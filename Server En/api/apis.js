const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('../routes/authRoutes');
const eventRoutes = require('../routes/eventRoutes');
const seedAdmin = require('../utils/seedAdmin');

const uri = process.env.MONGO_URI || process.env.URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for Vercel serverless
const allowedOrigins = [
    'http://localhost:5000',
    'http://localhost:5173',
    // 'https://event-ochre-psi.vercel.app'
];

// CORS middleware with explicit headers
app.use((req, res, next) => {
    const origin = req.headers.origin;
    // Allow all origins for now (can be restricted later)
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

// MongoDB Connection
let dbConnected = false;
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                retryWrites: true
            });
            console.log('✅ Connected to MongoDB');
            dbConnected = true;
            await seedAdmin().catch(err => console.log('Seed error:', err.message));
        }
    } catch (err) {
        console.log('MongoDB error:', err.message);
        dbConnected = false;
    }
};

// Connect to MongoDB on first request
let isConnecting = false;
app.use(async (req, res, next) => {
    if (!isConnecting && mongoose.connection.readyState === 0) {
        isConnecting = true;
        await connectDB();
        isConnecting = false;
    }
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'running',
        database: dbConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'EventPro API Server',
        status: dbConnected ? 'Connected' : 'Disconnected',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            events: '/api/events'
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
