// routes/users.js

const express = require('express');
const router = express.Router();
const { cacheUser, cacheUserIdentity, client } = require('../middleware/cacheMiddleware'); 
const User = require('../models/Users');

// Create a user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific user with accountNumber
router.get('/accountNumber/:accountNumber', getUserWithAccountNumber, (req, res) => {
  res.json(res.user);
});

// Get a specific user with identityNumber
router.get('/identityNumber/:identityNumber', getUserWithIdentityNumber, (req, res) => {
  res.json(res.user);
});

// Middleware to get a specific user by AccountNumber
async function getUserWithAccountNumber(req, res, next) {
  try {
    // Call the cacheUser middleware to check for cached data
    
    await cacheUser(req, res, async () => {
      const user = await User.findOne({ accountNumber: req.params.accountNumber });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log({ user }, typeof user)
      client.set(user.accountNumber, JSON.stringify(user))
      res.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


async function getUserWithIdentityNumber(req, res, next) {
  try {
    // Call the cacheUser middleware to check for cached data
    await cacheUserIdentity(req, res, async () => {
      const user = await User.findOne({ identityNumber: req.params.identityNumber });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log({ user }, typeof user)
      client.set(user.identityNumber, JSON.stringify(user))
      res.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// // Update a user
// router.patch('/:id', getUser, async (req, res) => {
//   if (req.body.username != null) {
//     res.user.username = req.body.username;
//   }
//   if (req.body.email != null) {
//     res.user.email = req.body.email;
//   }
//   if (req.body.password != null) {
//     res.user.password = req.body.password;
//   }
//   try {
//     const updatedUser = await res.user.save();
//     res.json(updatedUser);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Delete a user
// router.delete('/:id', getUser, async (req, res) => {
//   try {
//     await res.user.remove();
//     res.json({ message: 'User deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

module.exports = router;