const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
// require('dotenv').config();

// Load environment variables
// const { MONGODB_URI } = process.env;

// Connect to MongoDB
mongoose.connect('mongodb+srv://matthewbennettmail:QjBHNP8rVFAkkpPX@cluster0.o11vunl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
    runMigrations();
})
.catch(err => console.error('Failed to connect to MongoDB:', err));

async function runMigrations() {
    try {
        const migrationFiles = fs.readdirSync(path.join(__dirname, 'migrations'));

        for (const file of migrationFiles) {
            const migration = require(path.join(__dirname, 'migrations', file));
            await migration.up();
            console.log(`Migration ${file} applied successfully.`);
        }

        console.log('All migrations applied successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}