const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    length: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return next(
      new AppError('The user with this id does not exist on this server', 404)
    );

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

exports.getMe = (req, res) => {
  req.params.id = req.user.id;

  next();
};

exports.updateMyDetails = catchAsync(async (req, res, next) => {
  const allowedFields = ['firstName', 'lastName', 'username', 'email'];

  const filteredObj = filterObj(req.body, ...allowedFields);

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredObj,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  })
});

exports.deleteMe = catchAsync(async(req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success'
  })
})