// DATABASE CONFIGURATION FILE
// SmartCare Healthcare System

const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
    // FIX: All values from env only — no hardcoded credential fallbacks
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true,
        connectTimeout: 30000,
        requestTimeout: 30000,
        rowCollectionOnRequestCompletion: false
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
        acquireTimeoutMillis: 30000,
        evictionRunIntervalMillis: 10000
    }
};

let pool = null;
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;

async function connectDB() {
    // FIX: Validate required env vars before attempting connection
    const required = ['DB_USER', 'DB_PASSWORD', 'DB_SERVER', 'DB_NAME'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    try {
        console.log('========================================');
        console.log('🚀 Connecting to Azure SQL Database...');
        console.log(`📡 Server: ${dbConfig.server}`);
        console.log(`🗄️  Database: ${dbConfig.database}`);
        console.log(`👤 User: ${dbConfig.user}`);
        console.log('========================================');

        pool = await sql.connect(dbConfig);

        console.log('✅ Connected to Azure SQL Database successfully!');
        console.log(`   Max connections: ${dbConfig.pool.max}`);
        console.log(`   Idle timeout: ${dbConfig.pool.idleTimeoutMillis / 1000}s`);
        console.log('========================================');

        connectionAttempts = 0;

        const testResult = await pool.request()
            .query('SELECT GETUTCDATE() AS ServerTime, @@VERSION AS SQLVersion');
        console.log(`🕐 Server time: ${testResult.recordset[0].ServerTime}`);
        console.log('========================================');

        return pool;

    } catch (err) {
        connectionAttempts++;
        console.error('❌ Database connection failed!');
        console.error(`   Attempt: ${connectionAttempts} of ${MAX_RETRY_ATTEMPTS}`);
        console.error(`   Error: ${err.message}`);

        if (connectionAttempts <= MAX_RETRY_ATTEMPTS) {
            console.log(`🔄 Retrying in 5 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            return connectDB();
        }

        throw new Error(`Unable to connect to database after ${MAX_RETRY_ATTEMPTS} attempts: ${err.message}`);
    }
}

function getPool() {
    if (!pool) {
        throw new Error('Database not connected. Call connectDB() first.');
    }
    return pool;
}

function isConnected() {
    return pool !== null;
}

async function closeDB() {
    if (pool) {
        try {
            await pool.close();
            console.log('📴 Database connection closed');
            pool = null;
        } catch (err) {
            console.error('Error closing database connection:', err);
        }
    }
}

async function executeQuery(query, params = []) {
    // FIX: Renamed local variable to 'dbPool' to avoid shadowing module-level 'pool'
    const dbPool = getPool();
    const request = dbPool.request();

    params.forEach((param, index) => {
        request.input(`param${index}`, param.value);
    });

    try {
        return await request.query(query);
    } catch (err) {
        console.error('Query execution failed:', err);
        throw err;
    }
}

async function executeProcedure(procedureName, params = []) {
    // FIX: Renamed local variable to 'dbPool' to avoid shadowing module-level 'pool'
    const dbPool = getPool();
    const request = dbPool.request();

    params.forEach((param) => {
        request.input(param.name, param.type, param.value);
    });

    try {
        return await request.execute(procedureName);
    } catch (err) {
        console.error(`Procedure ${procedureName} execution failed:`, err);
        throw err;
    }
}

async function beginTransaction() {
    const dbPool = getPool();
    const transaction = dbPool.transaction();
    await transaction.begin();
    return transaction;
}

async function healthCheck() {
    if (!pool) {
        return { status: 'disconnected', message: 'Database connection pool not initialized' };
    }
    try {
        const result = await pool.request()
            .query('SELECT GETUTCDATE() AS current_time, 1 AS test');
        const poolStats = {
            active: pool.connected,
            totalConnections: pool.pool ? pool.pool.size : 0,
            availableConnections: pool.pool ? pool.pool.available : 0
        };
        return {
            status: 'healthy',
            serverTime: result.recordset[0].current_time,
            poolStats,
            timestamp: new Date().toISOString()
        };
    } catch (err) {
        return { status: 'unhealthy', error: err.message, timestamp: new Date().toISOString() };
    }
}

process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT. Closing database connection...');
    await closeDB();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM. Closing database connection...');
    await closeDB();
    process.exit(0);
});

process.on('uncaughtException', async (err) => {
    console.error('Uncaught Exception:', err);
    await closeDB();
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await closeDB();
    process.exit(1);
});

module.exports = {
    connectDB, getPool, closeDB, isConnected,
    executeQuery, executeProcedure, beginTransaction,
    healthCheck, sql, dbConfig
};
