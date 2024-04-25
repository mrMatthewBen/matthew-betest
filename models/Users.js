
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  accountNumber: String,
  emailAddress: String,
  identityNumber: String
});

module.exports = mongoose.model('User', userSchema);