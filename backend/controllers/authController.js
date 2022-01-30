const { promisify } = require('util');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// const res = require('express/lib/response');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, username, password, confirmPassword } =
    req.body;

  const details = {
    firstName,
    lastName,
    email,
    username,
    password,
    confirmPassword,
  };

  const user = await User.create(details);

  createSendToken(user, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { password, loginId } = req.body;

  let email, username;

  loginId.includes('@') ? (email = loginId) : (username = loginId);

  let user;

  if (username) {
    user = await User.findOne({ username }).select('+password');
    // console.log({ user });
    console.log('Username was used');
  } else if (email) {
    user = await User.findOne({ email }).select('+password');
    console.log('Email was used');
  }

  if (!user || !(await user.comparePasswords(password, user.password)));

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //Get token
  const token = '';

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split('@');
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // Check for token

  if (!token)
    return next(
      new AppError('You need to be signed in to access this route', 401)
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  if (!decoded)
    return next(
      new AppError(
        'This token does not belong to any user in the database',
        404
      )
    );

  const user = await User.findById(decoded.id);
  const checked = await user.changedPasswordAfter(decoded.iat);

  if (!checked)
    return next(
      new AppError(
        'Password has been changed since the last login. Log in again',
        401
      )
    );

  req.user = user;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(user.role))
      return next(
        new AppError('You are not authorized to perform this action', 401)
      );

    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword)
    return next(
      new AppError(
        'Please provide the required details to perform this action',
        400
      )
    );

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.comparePasswords(currentPassword, user.password)))
    return next(new AppError('Incorrect password', 401));

  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully',
  });
});
