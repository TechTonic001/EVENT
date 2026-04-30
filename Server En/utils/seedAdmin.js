const Organizer = require('../models/Organizer');

function getSeedAccount() {
    const envEmail = process.env.ADMIN_EMAIL;
    const envPassword = process.env.ADMIN_PASSWORD;
    if (envEmail && envPassword) {
        return { email: String(envEmail).toLowerCase(), password: envPassword };
    }

    // Development fallback so first-time local setup still works.
    if (process.env.NODE_ENV !== 'production') {
        return { email: 'admin@eventpro.com', password: 'Admin12345!' };
    }

    return null;
}

module.exports = async function seedAdmin() {
    try {
        const account = getSeedAccount();
        if (!account) {
            return;
        }

        const exists = await Organizer.findOne({ email: account.email });
        if (!exists) {
            await Organizer.create(account);
            console.log(`✓ Created organizer: ${account.email}`);
        }
    } catch (error) {
        console.error('Seed error:', error.message);
    }
};

