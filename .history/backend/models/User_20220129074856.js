const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { string } = require('sharp/lib/is');

const userSchema = mongoose.Schema(
  {
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
    photo: {
      type: String,
      default: 'default.jpg',
    },
    password: {
      type: String,
      required: [true, 'Password is needed for authentication'],
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords does not match!',
      },
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre('save', function () {});

const User = mongoose.model('User', userSchema);
module.exports = User;
