const jwt = require('jsonwebtoken');
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
