const redis = require('redis');
const client = redis.createClient(6379);

// Handle Redis client errors
client.on('error', (err) => {
    console.error('Redis client error:', err);
});

function cacheUser(req, res, next) {
    const accountNumber = req.params.accountNumber;

    console.log({accountNumber}, req.params)

    if (typeof accountNumber === 'undefined') {
        console.error('Error: Key is undefined');
        return;
    }

    client.get(accountNumber, (err, cachedData) => {
        if (err) throw err;

        if (cachedData !== null) {
            console.log('User data found in cache');
            console.log({cachedData})
            res.json(JSON.parse(cachedData));
        } else {
            next();
        }
    });
}

function cacheUserIdentity(req, res, next) {
    const identityNumber = req.params.identityNumber;

    console.log({identityNumber}, req.params)

    if (typeof identityNumber === 'undefined') {
        console.error('Error: Key is undefined');
        return;
    }

    client.get(identityNumber, (err, cachedData) => {
        if (err) throw err;

        if (cachedData !== null) {
            console.log('User data found in cache');
            console.log({cachedData})
            res.json(JSON.parse(cachedData));
        } else {
            next();
        }
    });
}

module.exports = { cacheUser, cacheUserIdentity, client };