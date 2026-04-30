const jwt = require('jsonwebtoken');

module.exports = function requireAuth(req, res, next) {
    try {
        const header = req.headers.authorization || '';
        const [type, token] = header.split(' ');
        if (type !== 'Bearer' || !token) return res.status(401).json({ message: 'Unauthorized' });

        const secret = process.env.JWT_SECRET;
        if (!secret) return res.status(500).json({ message: 'JWT_SECRET is not set' });

        const decoded = jwt.verify(token, secret);
        if (!decoded || !decoded.organizerId) return res.status(401).json({ message: 'Unauthorized' });

        req.organizerId = decoded.organizerId;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

