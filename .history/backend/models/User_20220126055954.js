const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'A user must have a first name'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'A user must have a last name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have an email address'],
    validate: [validator.isEmail, 'Please provide a valid email address.'],
    lowercase: true,
    unique: true,
  },
});
