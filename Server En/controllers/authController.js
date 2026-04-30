const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Organizer = require('../models/Organizer');

function signToken(organizerId) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not set');
    return jwt.sign({ organizerId }, secret, { expiresIn: '7d' });
}

// @desc    Login organizer (admin)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Development fallback login when database is offline.
        if (mongoose.connection.readyState !== 1 && process.env.NODE_ENV !== 'production') {
            const fallbackEmail = String(process.env.ADMIN_EMAIL || 'admin@eventpro.com').toLowerCase();
            const fallbackPassword = process.env.ADMIN_PASSWORD || 'Admin12345!';
            if (String(email).toLowerCase() === fallbackEmail && password === fallbackPassword) {
                const token = signToken('offline-admin');
                return res.json({
                    token,
                    organizer: { id: 'offline-admin', email: fallbackEmail }
                });
            }
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const organizer = await Organizer.findOne({ email: String(email).toLowerCase() }).select('+password');
        if (!organizer) return res.status(401).json({ message: 'Invalid credentials' });

        const ok = await organizer.matchPassword(password);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

        const token = signToken(organizer._id);
        return res.json({
            token,
            organizer: { id: organizer._id, email: organizer.email }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
