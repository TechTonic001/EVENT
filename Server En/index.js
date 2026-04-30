const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
mongoose.set('bufferCommands', false);

// Import routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const seedAdmin = require('./utils/seedAdmin');

const port = process.env.PORT || 5000;
const rawUri = process.env.URI || process.env.MONGO_URI || '';
const uri = rawUri.replace(/^['"`]|['"`]$/g, '');
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration: configurable via CORS_ORIGINS (comma-separated)
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

// CORS middleware with explicit headers
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (!origin || allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin || '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

// Fallback CORS for any missed origins in development
if (!isProduction) {
    app.use(cors({ origin: true, credentials: true }));
}

// MongoDB Connection with retry logic
let dbConnected = false;
let connectionAttempts = 0;
const maxRetries = 3;

const connectDB = () => {
    if (!uri) {
        console.log('⚠️  URI is not set. Starting server without database connection.');
        dbConnected = false;
        return;
    }

    connectionAttempts++;
    console.log(`\n📡 Connecting to MongoDB (attempt ${connectionAttempts}/${maxRetries})...`);
    console.log(`   URI: ${uri.substring(0, 50)}...`);

    mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 45000,
        retryWrites: true
    })
        .then(() => {
            console.log('✅ Connected to MongoDB successfully');
            dbConnected = true;
            seedAdmin().catch((err) => console.log('⚠️  Seed admin failed:', err.message));
        })
        .catch((err) => {
            console.log('❌ MongoDB connection error:', err.message);

            if (connectionAttempts < maxRetries) {
                console.log(`⏳ Retrying in 5 seconds... (${connectionAttempts}/${maxRetries})`);
                setTimeout(connectDB, 5000);
            } else {
                console.log('⚠️  Starting server in offline mode.');
                console.log('📋 Troubleshooting steps:');
                console.log('   1. Check MongoDB Atlas cluster status');
                console.log('   2. Verify IP whitelist includes: 0.0.0.0/0');
                console.log('   3. Check database credentials are correct');
                dbConnected = false;
            }
        })
};

connectDB();

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'running', database: dbConnected ? 'connected' : 'disconnected' });
});

// Fail fast for DB-backed APIs when database is not ready.
app.use('/api', (req, res, next) => {
    if (req.path === '/auth/login') {
        return next();
    }
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ message: 'Database not connected yet. Please try again.' });
    }
    return next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
    res.send('EventPro API Server running. Database: ' + (dbConnected ? 'Connected' : 'Disconnected'));
});

// Start server only when executed directly
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
        console.log(`Health check: http://localhost:${port}/health`);
    });
}

// Export for Vercel serverless
module.exports = app;