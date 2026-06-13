const jwt = require('jsonwebtoken');
const { getPool, sql } = require('../config/database');

// Middleware to verify JWT token
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // BUG FIX: Added guard — if JWT_SECRET is missing, jwt.verify throws, but we
        // should also ensure decoded contains the expected userId field.
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ error: 'Invalid token payload' });
        }

        // Verify user still exists and is active in DB
        const pool = getPool();
        const result = await pool.request()
            .input('userId', sql.Int, decoded.userId)
            .query('SELECT user_id, email, role, is_active FROM Users WHERE user_id = @userId');

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (!result.recordset[0].is_active) {
            return res.status(401).json({ error: 'Account is inactive' });
        }

        // Attach full user record to request
        req.user = result.recordset[0];
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: 'Invalid token' });
        }
        // Unexpected errors (e.g. DB down)
        console.error('authenticateToken error:', err);
        return res.status(500).json({ error: 'Authentication failed' });
    }
}

// Middleware to check user role
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Access denied. Required role: ' + allowedRoles.join(', ')
            });
        }

        next();
    };
}

module.exports = { authenticateToken, authorizeRoles };
