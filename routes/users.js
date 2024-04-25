// routes/users.js

const express = require("express");
const router = express.Router();
const {
  cacheUser,
  cacheUserAccountNumber,
  cacheUserIdentity,
  client,
} = require("../middleware/cacheMiddleware");
const User = require("../models/Users");

// Create a user
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific user with accountNumber
router.get("/:accountId", getUser, (req, res) => {
  res.json(res.user);
});

// Get a specific user with accountNumber
router.get(
  "/accountNumber/:accountNumber",
  getUserWithAccountNumber,
  (req, res) => {
    res.json(res.user);
  },
);

// Get a specific user with identityNumber
router.get(
  "/identityNumber/:identityNumber",
  getUserWithIdentityNumber,
  (req, res) => {
    res.json(res.user);
  },
);

// Middleware to get a specific user by AccountNumber
async function getUserWithAccountNumber(req, res, next) {
  try {
    // Call the cacheUserAccountNumber middleware to check for cached data
    cacheUserAccountNumber(req, res, async () => {
      const user = await User.findOne({
        accountNumber: req.params.accountNumber,
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      client.set(user.accountNumber, JSON.stringify(user));
      res.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getUserWithIdentityNumber(req, res, next) {
  try {
    // Call the cacheUserAccountNumber middleware to check for cached data
    cacheUserIdentity(req, res, async () => {
      const user = await User.findOne({
        identityNumber: req.params.identityNumber,
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      client.set(user.identityNumber, JSON.stringify(user));
      res.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getUser(req, res, next) {
  try {
    // Call the cacheUserAccountNumber middleware to check for cached data
    cacheUser(req, res, async () => {
      const user = await User.findById(req.params.accountId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      client.set(user._id.toString(), JSON.stringify(user));
      res.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Update a user
router.patch("/:accountId", getUser, async (req, res) => {
  if (req.body.userName != null) {
    res.user.userName = req.body.userName;
  }
  if (req.body.emailAddress != null) {
    res.user.emailAddress = req.body.emailAddress;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a user
router.delete("/:accountId", getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
