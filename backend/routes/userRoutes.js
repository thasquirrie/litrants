const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('moderator', 'admin'),
    userController.getUsers
  );

router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.updateMyDetails);

module.exports = router;
