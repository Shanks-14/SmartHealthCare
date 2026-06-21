const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { getPool, sql } = require('../config/database');

// GET /api/doctors — public list for booking
router.get('/', async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request().query(`
            SELECT d.doctor_id, d.first_name, d.last_name, d.specialty,
                   d.email, d.phone, d.experience, d.consultation_fee,
                   u.is_active
            FROM Doctors d JOIN Users u ON d.user_id = u.user_id
            WHERE u.is_active = 1
            ORDER BY d.specialty, d.last_name
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/doctors/:id/slots
router.get('/:id/slots', async (req, res) => {
    const { date } = req.query;
    try {
        const pool = getPool();
        const result = await pool.request()
            .input('doctor_id', sql.Int, req.params.id)
            .input('date', sql.Date, date)
            .query(`
                SELECT slot_time, is_booked FROM AppointmentSlots
                WHERE doctor_id = @doctor_id AND slot_date = @date
                ORDER BY slot_time
            `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/doctors/dashboard
router.get('/dashboard', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request()
            .input('user_id', sql.Int, req.user.user_id)
            .query(`
                SELECT d.*,
                  (SELECT COUNT(*) FROM Appointments a WHERE a.doctor_id = d.doctor_id
                   AND CAST(a.appointment_date AS DATE) = CAST(GETUTCDATE() AS DATE)) AS today_count,
                  (SELECT COUNT(DISTINCT a.patient_id) FROM Appointments a WHERE a.doctor_id = d.doctor_id) AS total_patients
                FROM Doctors d WHERE d.user_id = @user_id
            `);
        res.json(result.recordset[0] || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/doctors/appointments/today
router.get('/appointments/today', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request()
            .input('user_id', sql.Int, req.user.user_id)
            .query(`
                SELECT a.*, p.first_name + ' ' + p.last_name AS patient_name,
                       p.phone AS patient_phone
                FROM Appointments a
                JOIN Doctors d ON a.doctor_id = d.doctor_id
                JOIN Patients p ON a.patient_id = p.patient_id
                WHERE d.user_id = @user_id
                  AND CAST(a.appointment_date AS DATE) = CAST(GETUTCDATE() AS DATE)
                ORDER BY a.appointment_date
            `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/doctors/schedule
router.get('/schedule', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
    const { date } = req.query;
    try {
        const pool = getPool();
        const result = await pool.request()
            .input('user_id', sql.Int, req.user.user_id)
            .input('date', sql.Date, date)
            .query(`
                SELECT a.*, p.first_name + ' ' + p.last_name AS patient_name
                FROM Appointments a
                JOIN Doctors d ON a.doctor_id = d.doctor_id
                JOIN Patients p ON a.patient_id = p.patient_id
                WHERE d.user_id = @user_id
                  AND CAST(a.appointment_date AS DATE) = @date
                ORDER BY a.appointment_date
            `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/doctors/patients
router.get('/patients', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request()
            .input('user_id', sql.Int, req.user.user_id)
            .query(`
                SELECT DISTINCT p.patient_id, p.first_name, p.last_name, p.email, p.phone,
                       p.dob, p.gender, p.allergies,
                       MAX(a.appointment_date) AS last_visit
                FROM Patients p
                JOIN Appointments a ON p.patient_id = a.patient_id
                JOIN Doctors d ON a.doctor_id = d.doctor_id
                WHERE d.user_id = @user_id
                GROUP BY p.patient_id, p.first_name, p.last_name, p.email,
                         p.phone, p.dob, p.gender, p.allergies
                ORDER BY last_visit DESC
            `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/doctors/patients/:id
router.get('/patients/:id', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request()
            .input('patient_id', sql.Int, req.params.id)
            .query('SELECT * FROM Patients WHERE patient_id = @patient_id');
        if (result.recordset.length === 0) return res.status(404).json({ error: 'Patient not found' });
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/doctors/appointments/:id/status
router.put('/appointments/:id/status', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
    const { status, notes } = req.body;
    try {
        const pool = getPool();
        await pool.request()
            .input('appointment_id', sql.Int, req.params.id)
            .input('status', sql.NVarChar, status)
            .input('notes', sql.NVarChar, notes || null)
            .query(`
                UPDATE Appointments SET status=@status, doctor_notes=@notes, updated_at=GETUTCDATE()
                WHERE appointment_id=@appointment_id
            `);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/doctors/availability
router.get('/availability', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request()
            .input('user_id', sql.Int, req.user.user_id)
            .query(`
                SELECT da.* FROM DoctorAvailability da
                JOIN Doctors d ON da.doctor_id = d.doctor_id
                WHERE d.user_id = @user_id
            `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/doctors/availability
router.put('/availability', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
    const { startTime, endTime, duration, maxPatients, days } = req.body;
    try {
        const pool = getPool();
        await pool.request()
            .input('user_id', sql.Int, req.user.user_id)
            .input('start_time', sql.NVarChar, startTime)
            .input('end_time', sql.NVarChar, endTime)
            .input('duration', sql.Int, duration)
            .input('max_patients', sql.Int, maxPatients)
            .input('days', sql.NVarChar, JSON.stringify(days))
            .query(`
                UPDATE DoctorAvailability
                SET start_time=@start_time, end_time=@end_time, slot_duration=@duration,
                    max_patients=@max_patients, working_days=@days, updated_at=GETUTCDATE()
                FROM DoctorAvailability da JOIN Doctors d ON da.doctor_id = d.doctor_id
                WHERE d.user_id=@user_id
            `);
        res.json({ success: true, message: 'Availability updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/doctors/appointments/:id/start-call
router.post('/appointments/:id/start-call', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
    try {
        // In production: create Azure ACS room and return join URL
        res.json({ success: true, callUrl: `https://meet.smartcare.ie/room/${req.params.id}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
