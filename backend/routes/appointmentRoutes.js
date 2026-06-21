const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { getPool, sql } = require('../config/database');

// GET /api/appointments — admin
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request().query(`
            SELECT a.*,
                   p.first_name + ' ' + p.last_name AS patient_name,
                   d.first_name + ' ' + d.last_name AS doctor_name,
                   d.specialty
            FROM Appointments a
            JOIN Patients p ON a.patient_id = p.patient_id
            JOIN Doctors d ON a.doctor_id = d.doctor_id
            ORDER BY a.appointment_date DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/appointments/upcoming — patient
router.get('/upcoming', authenticateToken, authorizeRoles('patient'), async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request()
            .input('user_id', sql.Int, req.user.user_id)
            .query(`
                SELECT a.*, d.first_name + ' ' + d.last_name AS doctor_name, d.specialty
                FROM Appointments a
                JOIN Patients p ON a.patient_id = p.patient_id
                JOIN Doctors d ON a.doctor_id = d.doctor_id
                WHERE p.user_id = @user_id AND a.appointment_date >= GETUTCDATE()
                  AND a.status NOT IN ('Cancelled')
                ORDER BY a.appointment_date ASC
            `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/appointments/patient — all patient appointments
router.get('/patient', authenticateToken, authorizeRoles('patient'), async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request()
            .input('user_id', sql.Int, req.user.user_id)
            .query(`
                SELECT a.*, d.first_name + ' ' + d.last_name AS doctor_name, d.specialty, d.consultation_fee AS fee
                FROM Appointments a
                JOIN Patients p ON a.patient_id = p.patient_id
                JOIN Doctors d ON a.doctor_id = d.doctor_id
                WHERE p.user_id = @user_id
                ORDER BY a.appointment_date DESC
            `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/appointments/:id
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request()
            .input('appointment_id', sql.Int, req.params.id)
            .query(`
                SELECT a.*, p.first_name + ' ' + p.last_name AS patient_name,
                       d.first_name + ' ' + d.last_name AS doctor_name, d.specialty
                FROM Appointments a
                JOIN Patients p ON a.patient_id = p.patient_id
                JOIN Doctors d ON a.doctor_id = d.doctor_id
                WHERE a.appointment_id = @appointment_id
            `);
        if (result.recordset.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/appointments/book — patient books
router.post('/book', authenticateToken, authorizeRoles('patient'), async (req, res) => {
    const { doctorId, date, time, consultationType, notes } = req.body;
    const pool = getPool();
    const transaction = pool.transaction();
    try {
        await transaction.begin();

        const patientResult = await transaction.request()
            .input('user_id', sql.Int, req.user.user_id)
            .query('SELECT patient_id FROM Patients WHERE user_id = @user_id');

        if (patientResult.recordset.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Patient record not found' });
        }
        const patientId = patientResult.recordset[0].patient_id;

        const result = await transaction.request()
            .input('patient_id', sql.Int, patientId)
            .input('doctor_id', sql.Int, doctorId)
            .input('appointment_date', sql.DateTime, new Date(`${date} ${time}`))
            .input('consultation_type', sql.NVarChar, consultationType || 'Video Call')
            .input('notes', sql.NVarChar, notes || null)
            .input('status', sql.NVarChar, 'Upcoming')
            .query(`
                INSERT INTO Appointments
                  (patient_id, doctor_id, appointment_date, consultation_type, notes, status, created_at, updated_at)
                OUTPUT INSERTED.appointment_id
                VALUES (@patient_id, @doctor_id, @appointment_date, @consultation_type, @notes, @status, GETUTCDATE(), GETUTCDATE())
            `);

        await transaction.commit();
        res.status(201).json({ success: true, appointment_id: result.recordset[0].appointment_id });
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ error: err.message });
    }
});

// POST /api/appointments — alias used by frontend
router.post('/', authenticateToken, authorizeRoles('patient'), async (req, res) => {
    req.url = '/book';
    return router.handle(req, res);
});

// PUT /api/appointments/:id/cancel
router.put('/:id/cancel', authenticateToken, async (req, res) => {
    const { reason } = req.body;
    try {
        const pool = getPool();
        await pool.request()
            .input('appointment_id', sql.Int, req.params.id)
            .input('reason', sql.NVarChar, reason || null)
            .query(`
                UPDATE Appointments SET status='Cancelled', cancel_reason=@reason, updated_at=GETUTCDATE()
                WHERE appointment_id=@appointment_id
            `);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
