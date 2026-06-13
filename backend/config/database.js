// DATABASE CONFIGURATION FILE
// SmartCare Healthcare System

const sql = require('mssql');
require('dotenv').config();

// DATABASE CONFIGURATION

const dbConfig = {
    // Azure SQL Database connection info
    // BUG FIX: Removed hardcoded credential fallbacks — all values must come from .env
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 1433,

    // Connection options required for Azure SQL
    options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true,
        connectTimeout: 30000,             // 30 seconds timeout
        requestTimeout: 30000,             // 30 seconds timeout
        rowCollectionOnRequestCompletion: false
    },

    // Connection pool settings
    pool: {
        max: 10,                          // Maximum number of connections
        min: 0,                           // Minimum number of connections
        idleTimeoutMillis: 30000,         // Closing idle connections after 30 seconds
        acquireTimeoutMillis: 30000,       // Timeout connection
        evictionRunIntervalMillis: 10000  // Checking for idle connections every 10 seconds
    }
};


// CONNECTION POOL MANAGEMENT

let pool = null;
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;

/*
 * Connect to Azure SQL Database
 * Creates a connection pool and manages reconnection logic
 */
async function connectDB() {
    // BUG FIX: Validate required env vars before attempting connection
    const required = ['DB_USER', 'DB_PASSWORD', 'DB_SERVER', 'DB_NAME'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    try {
        console.log('========================================');
        console.log('🚀 Connecting to Azure SQL Database...');
        console.log(`📡 Server: ${dbConfig.server}`);
        console.log(`🗄️ Database: ${dbConfig.database}`);
        console.log(`👤 User: ${dbConfig.user}`);
        console.log('========================================');

        // Creating connection pool
        pool = await sql.connect(dbConfig);

        console.log('✅ Connected to Azure SQL Database successfully!');
        console.log('📊 Connection pool created');
        console.log(`   Max connections: ${dbConfig.pool.max}`);
        console.log(`   Idle timeout: ${dbConfig.pool.idleTimeoutMillis / 1000} seconds`);
        console.log('========================================');

        connectionAttempts = 0; // Reset attempts on successful connection

        // Testing connection with a simple query
        const testResult = await pool.request().query('SELECT GETUTCDATE() AS ServerTime, @@VERSION AS SQLVersion');
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

/*
 * Get the database connection pool
 * @returns {Object} SQL connection pool
 */
function getPool() {
    if (!pool) {
        throw new Error('Database not connected. Call connectDB() first.');
    }
    return pool;
}

/*
 * Check if database is connected
 * @returns {boolean} True if connected, false otherwise
 */
function isConnected() {
    return pool !== null;
}

/*
 * Close database connection
 */
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


// HELPER FUNCTIONS FOR COMMON OPERATIONS

/*
 * Execute a query with parameters
 * @param {string} query - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
async function executeQuery(query, params = []) {
    // BUG FIX: Renamed local variable from 'pool' to 'dbPool' to avoid shadowing
    // the module-level 'pool' variable
    const dbPool = getPool();
    const request = dbPool.request();

    // Add parameters to request
    params.forEach((param, index) => {
        request.input(`param${index}`, param.value);
    });

    try {
        const result = await request.query(query);
        return result;
    } catch (err) {
        console.error('Query execution failed:', err);
        throw err;
    }
}

/*
 * Execute a stored procedure
 * @param {string} procedureName - Name of stored procedure
 * @param {Array} params - Procedure parameters
 * @returns {Promise<Object>} Procedure result
 */
async function executeProcedure(procedureName, params = []) {
    // BUG FIX: Renamed local variable from 'pool' to 'dbPool' to avoid shadowing
    const dbPool = getPool();
    const request = dbPool.request();

    // Add parameters to request
    params.forEach((param) => {
        request.input(param.name, param.type, param.value);
    });

    try {
        const result = await request.execute(procedureName);
        return result;
    } catch (err) {
        console.error(`Procedure ${procedureName} execution failed:`, err);
        throw err;
    }
}

/*
 * Begin a transaction
 * @returns {Promise<Object>} Transaction object
 */
async function beginTransaction() {
    const dbPool = getPool();
    const transaction = dbPool.transaction();
    await transaction.begin();
    return transaction;
}


// DATABASE HEALTH CHECK

/*
 * Check database health and performance
 */
async function healthCheck() {
    if (!pool) {
        return { status: 'disconnected', message: 'Database connection pool not initialized' };
    }

    try {
        const result = await pool.request().query('SELECT GETUTCDATE() AS current_time, 1 AS test');

        const poolStats = {
            active: pool.connected,
            totalConnections: pool.pool ? pool.pool.size : 0,
            availableConnections: pool.pool ? pool.pool.available : 0
        };

        return {
            status: 'healthy',
            serverTime: result.recordset[0].current_time,
            poolStats: poolStats,
            timestamp: new Date().toISOString()
        };

    } catch (err) {
        return {
            status: 'unhealthy',
            error: err.message,
            timestamp: new Date().toISOString()
        };
    }
}


// ERROR HANDLING FOR DATABASE CONNECTION

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


// EXPORT MODULES

module.exports = {
    connectDB,
    getPool,
    closeDB,
    isConnected,
    executeQuery,
    executeProcedure,
    beginTransaction,
    healthCheck,
    sql,
    dbConfig
};
