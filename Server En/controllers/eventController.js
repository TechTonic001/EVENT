const Event = require('../models/Event');

// POST /api/events
exports.createEvent = async (req, res) => {
    try {
        const organizerId = req.organizerId;
        const {
            name,
            description,
            startDate,
            endDate,
            location,
            ticketPrice,
            totalCapacity
        } = req.body;

        if (!name || !startDate || !endDate || !location || ticketPrice === undefined || totalCapacity === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const payload = {
            organizerId,
            name,
            description: description || '',
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            location,
            ticketPrice: Number(ticketPrice),
            totalCapacity: Number(totalCapacity)
        };

        // Minimal status logic for MVP
        payload.status = payload.totalCapacity > 0 ? 'On Sale' : 'Draft';

        const created = await Event.create(payload);
        return res.status(201).json(created);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// GET /api/events
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find({ organizerId: req.organizerId }).sort({ createdAt: -1 });
        return res.json(events);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// GET /api/events/stats
exports.getStats = async (req, res) => {
    try {
        const events = await Event.find({ organizerId: req.organizerId });
        const totalTicketsSold = events.reduce((sum, e) => sum + (Number(e.ticketsSold) || 0), 0);
        const totalRevenue = events.reduce(
            (sum, e) => sum + (Number(e.ticketPrice) || 0) * (Number(e.ticketsSold) || 0),
            0
        );
        return res.json({ totalRevenue, totalTicketsSold });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

