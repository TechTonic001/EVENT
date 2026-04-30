const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organizer', required: true, index: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        location: { type: String, required: true, trim: true },
        ticketPrice: { type: Number, required: true, min: 0 },
        totalCapacity: { type: Number, required: true, min: 0 },
        ticketsSold: { type: Number, default: 0, min: 0 },
        status: { type: String, enum: ['Draft', 'On Sale', 'Sold Out'], default: 'Draft' }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);

