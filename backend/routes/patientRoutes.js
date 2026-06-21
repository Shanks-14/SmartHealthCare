const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { getPool, sql } = require('../config/database');

// GET /api/patients — admin only
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request().query(`
            SELECT p.patient_id, p.first_name, p.last_name, p.email, p.phone, p.dob, p.gender,
                   u.is_active, u.last_login
            FROM Patients p
            JOIN Users u ON p.user_id = u.user_id
            ORDER BY p.created_at DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/patients/dashboard
router.get('/dashboard', authenticateToken, authorizeRoles('patient'), async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request()
            .input('user_id', sql.Int, req.user.user_id)
            .query(`
                SELECT p.*, u.last_login
                FROM Patients p JOIN Users u ON p.user_id = u.user_id
                WHERE p.user_id = @user_id
            `);
        res.json(result.recordset[0] || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/patients/reports
router.get('/reports', authenticateToken, authorizeRoles('patient'), async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request()
            .input('user_id', sql.Int, req.user.user_id)
            .query(`
                SELECT mr.*, d.first_name + ' ' + d.last_name AS doctor_name
                FROM MedicalReports mr
                JOIN Patients p ON mr.patient_id = p.patient_id
                JOIN Doctors d ON mr.doctor_id = d.doctor_id
                WHERE p.user_id = @user_id
                ORDER BY mr.created_at DESC
            `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/patients/profile
router.put('/profile', authenticateToken, authorizeRoles('patient'), async (req, res) => {
    const { firstName, lastName, phone, address, allergies } = req.body;
    try {
        const pool = getPool();
        await pool.request()
            .input('user_id', sql.Int, req.user.user_id)
            .input('first_name', sql.NVarChar, firstName)
            .input('last_name', sql.NVarChar, lastName)
            .input('phone', sql.NVarChar, phone)
            .input('address', sql.NVarChar, address)
            .input('allergies', sql.NVarChar, allergies)
            .query(`
                UPDATE Patients SET first_name=@first_name, last_name=@last_name,
                phone=@phone, address=@address, allergies=@allergies, updated_at=GETUTCDATE()
                WHERE user_id=@user_id
            `);
        res.json({ success: true, message: 'Profile updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/patients/health-metrics
router.get('/health-metrics', authenticateToken, authorizeRoles('patient'), async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request()
            .input('user_id', sql.Int, req.user.user_id)
            .query(`
                SELECT hm.* FROM HealthMetrics hm
                JOIN Patients p ON hm.patient_id = p.patient_id
                WHERE p.user_id = @user_id
                ORDER BY hm.recorded_at DESC
            `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
