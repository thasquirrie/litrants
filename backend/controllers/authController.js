const { promisify } = require('util');
const User = require('User');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const res = require('express/lib/response');

const signToken = (id) => {
  return (
    jwt.sign({ id }),
    process.env.JWT_SECRET,
    {
      expiresIn: processenv.EXPIRES_IN,
    }
  );
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

exports.signup = catchAsycn(async (req, res, next) => {
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
  const { email, password, username } = req.body;

  if ((!email && !username) || password)
    return next(
      new AppError('Please provide the required details to login', 400)
    );

  let user;

  if (username) {
    user = await User.findOne({ username }).select('+password');
  } else if (email) {
    user = await User.findOne({ email }).select('+password');
  }

  console.log(user);

  user.comparePassword(password, user.password);
});
