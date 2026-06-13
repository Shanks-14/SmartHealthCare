// SMART CARE API - MAIN SERVER FILE

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { connectDB, healthCheck } = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const medicalRoutes = require('./routes/medicalRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// BUG FIX: Declare 'server' at module scope so SIGTERM handler can reference it
let server;

// MIDDLEWARE

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});


// ROUTES

// Health check endpoint
app.get('/api/health', async (req, res) => {
    const dbHealth = await healthCheck();
    res.json({
        status: 'running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        database: dbHealth,
        uptime: process.uptime()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical', medicalRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.url} does not exist`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        status: err.status || 500,
        timestamp: new Date().toISOString()
    });
});


// START SERVER

async function startServer() {
    try {
        // Connect to database first
        await connectDB();
        console.log('✅ Database connection established');

        // BUG FIX: Assign app.listen() result to module-scoped 'server' variable
        // so it can be referenced in the SIGTERM handler below
        server = app.listen(PORT, () => {
            console.log('========================================');
            console.log('🚀 SmartCare API Server Started');
            console.log(`📡 Listening on port: ${PORT}`);
            console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
            console.log(`🕐 Started at: ${new Date().toISOString()}`);
            console.log('========================================');
            console.log('📋 Available Endpoints:');
            console.log('   POST   /api/auth/register     - User registration');
            console.log('   POST   /api/auth/login        - User login');
            console.log('   GET    /api/auth/me           - Get current user');
            console.log('   GET    /api/patients          - List all patients');
            console.log('   GET    /api/doctors           - List all doctors');
            console.log('   GET    /api/appointments      - Get appointments');
            console.log('   POST   /api/appointments/book - Book appointment');
            console.log('   GET    /api/health            - Health check');
            console.log('========================================');
        });

    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

// BUG FIX: 'server' is now defined at module scope, so this handler works correctly
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    if (server) {
        server.close(() => {
            console.log('Server closed');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});

// Start the server
startServer();

module.exports = app;
