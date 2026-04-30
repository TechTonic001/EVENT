const Organizer = require('../models/Organizer');
const mongoose = require('mongoose');
require('dotenv').config();

// Default organizers to seed
const organizers = [
    {
        email: 'admin@eventpro.com',
        password: 'Admin12345!'
    },
    {
        email: 'john@eventpro.com',
        password: 'JohnPass123!'
    },
    {
        email: 'sarah@eventpro.com',
        password: 'SarahPass123!'
    },
    {
        email: 'mike@eventpro.com',
        password: 'MikePass123!'
    }
];

async function seedOrganizers() {
    try {
        const uri = process.env.MONGO_URI || process.env.URI;

        // Connect to MongoDB
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('✓ Connected to MongoDB');

        // Add each organizer if it doesn't exist
        for (const org of organizers) {
            const exists = await Organizer.findOne({ email: org.email });

            if (!exists) {
                const newOrg = await Organizer.create({
                    email: org.email.toLowerCase(),
                    password: org.password
                });
                console.log(`✓ Created organizer: ${org.email}`);
            } else {
                console.log(`✓ Already exists: ${org.email}`);
            }
        }

        // Display all organizers
        const allOrganizers = await Organizer.find({}, 'email -password');
        console.log('\n✓ All Organizers in Database:');
        allOrganizers.forEach((org, i) => {
            console.log(`  ${i + 1}. ${org.email}`);
        });

        console.log('\n✓ Seeding complete!');
        await mongoose.connection.close();
    } catch (error) {
        console.error('✗ Seeding failed:', error.message);
        process.exit(1);
    }
}

seedOrganizers();
