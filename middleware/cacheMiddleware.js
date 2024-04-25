const redis = require("redis");
const client = redis.createClient(6379);

// Handle Redis client errors
client.on("error", (err) => {
  console.error("Redis client error:", err);
});

function cacheUser(req, res, next) {
  const accountId = req.params.accountId;

  const operationType = req.method;

  if (typeof accountId === "undefined") {
    console.error("Error: Key is undefined");
    return;
  }

  client.get(accountId, (err, cachedData) => {
    if (err) throw err;

    if (cachedData !== null) {
      if (operationType != "GET") {
        next();
      } else {
        res.json(JSON.parse(cachedData));
      }
    } else {
      next();
    }
  });
}

function cacheUserAccountNumber(req, res, next) {
  const accountNumber = req.params.accountNumber;

  if (typeof accountNumber === "undefined") {
    console.error("Error: Key is undefined");
    return;
  }

  client.get(accountNumber, (err, cachedData) => {
    if (err) throw err;

    if (cachedData !== null) {
      res.json(JSON.parse(cachedData));
    } else {
      next();
    }
  });
}

function cacheUserIdentity(req, res, next) {
  const identityNumber = req.params.identityNumber;

  console.log({ identityNumber }, req.params);

  if (typeof identityNumber === "undefined") {
    console.error("Error: Key is undefined");
    return;
  }

  client.get(identityNumber, (err, cachedData) => {
    if (err) throw err;

    if (cachedData !== null) {
      res.json(JSON.parse(cachedData));
    } else {
      next();
    }
  });
}

module.exports = {
  cacheUser,
  cacheUserAccountNumber,
  cacheUserIdentity,
  client,
};
