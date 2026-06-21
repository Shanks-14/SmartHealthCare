const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { getPool, sql } = require('../config/database');

// GET /api/medical/reports/:id/download — generate SAS URL for blob
router.get('/reports/:id/download', authenticateToken, async (req, res) => {
    try {
        // In production: generate Azure Blob SAS token here
        res.json({ success: true, downloadUrl: `https://smartcarestorage.blob.core.windows.net/patient-reports/report-${req.params.id}.pdf` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/medical/reports — upload new report metadata
router.post('/reports', authenticateToken, authorizeRoles('doctor', 'patient'), async (req, res) => {
    const { patientId, fileName, fileSize, reportType, blobUrl } = req.body;
    try {
        const pool = getPool();
        await pool.request()
            .input('patient_id', sql.Int, patientId)
            .input('file_name', sql.NVarChar, fileName)
            .input('file_size', sql.NVarChar, fileSize)
            .input('report_type', sql.NVarChar, reportType)
            .input('blob_url', sql.NVarChar, blobUrl)
            .query(`
                INSERT INTO MedicalReports (patient_id, file_name, file_size, report_type, blob_url, created_at)
                VALUES (@patient_id, @file_name, @file_size, @report_type, @blob_url, GETUTCDATE())
            `);
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
