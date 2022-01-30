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
    username: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'A user must have an email address'],
      validate: [validator.isEmail, 'Please provide a valid email address.'],
      lowercase: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'],
      default: 'user',
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 2000;
});

userSchema.methods.comparePasswords = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = async function (timestamp) {
  if (this.passwordChangedAfter) {
    const changedTime = this.passwordChangedAt.getTime() / 1000;

    return timestamp < changedTime;
  }

  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
