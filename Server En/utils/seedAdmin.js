const Organizer = require('../models/Organizer');

// Default organizers
const defaultOrganizers = [
    { email: 'admin@eventpro.com', password: 'Admin12345!' },
    { email: 'john@eventpro.com', password: 'JohnPass123!' },
    { email: 'sarah@eventpro.com', password: 'SarahPass123!' },
    { email: 'mike@eventpro.com', password: 'MikePass123!' }
];

module.exports = async function seedAdmin() {
    try {
        // Seed default organizers if they don't exist
        for (const org of defaultOrganizers) {
            const exists = await Organizer.findOne({ email: org.email });
            if (!exists) {
                await Organizer.create({ email: org.email, password: org.password });
                console.log(`✓ Created organizer: ${org.email}`);
            }
        }
        
        // Also seed from env if provided
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        if (email && password) {
            const normalizedEmail = String(email).toLowerCase();
            const exists = await Organizer.findOne({ email: normalizedEmail });
            if (!exists) {
                await Organizer.create({ email: normalizedEmail, password });
                console.log(`✓ Created organizer: ${normalizedEmail}`);
            }
        }
    } catch (error) {
        console.error('Seed error:', error.message);
    }
};

