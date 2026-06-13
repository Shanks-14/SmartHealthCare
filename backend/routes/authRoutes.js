const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const { register, login, getCurrentUser, changePassword } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Middleware that returns 422 if express-validator found errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }
    next();
};

const registerValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('first_name').trim().notEmpty().withMessage('First name required'),
    body('last_name').trim().notEmpty().withMessage('Last name required'),
    body('role').optional().isIn(['patient', 'doctor', 'admin']).withMessage('Invalid role'),
];

const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
];

const changePasswordValidation = [
    body('current_password').notEmpty().withMessage('Current password required'),
    body('new_password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

// POST /api/auth/register
router.post('/register', registerValidation, validateRequest, register);

// POST /api/auth/login
router.post('/login', loginValidation, validateRequest, login);

// GET /api/auth/me
router.get('/me', authenticateToken, getCurrentUser);

// POST /api/auth/change-password
router.post(
    '/change-password',
    authenticateToken,
    changePasswordValidation,
    validateRequest,
    changePassword
);

module.exports = router;
