const { MongoClient } = require('mongodb');
const config = require('./migrate-mongo-config');

async function testConnection() {
    const { url, databaseName, options } = config.mongodb;
    let client;

    try {
        client = await MongoClient.connect(url, options);
        const adminDb = client.db(databaseName).admin();
        await adminDb.ping();

        console.log('Connection to MongoDB Atlas successful');
    } catch (error) {
        console.error('Failed to connect to MongoDB Atlas:', error);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

testConnection();