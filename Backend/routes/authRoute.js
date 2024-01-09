const express = require('express');
const authController = require('../controllers/authController');
const emailController = require('../controllers/emailController');
const validationCreateAccount = require('../middlewares/validation/validationCreateAccount.middleware');
const authenticateUser = require('../middlewares/authentication.middleware');
const refreshToken = require("../middlewares/refreshtoken.middleware");
const router = express.Router();

router.post('/send_otp', emailController.createOTP);
router.patch('/forgot_password', authController.forgotPassword);
router.post('/create', validationCreateAccount.validationCreate, authController.createAccount);
router.post('/login', authController.login);
router.post('/logout', authenticateUser, authController.logout)
router.post('/refresh_token', refreshToken, authController.refreshToken)
module.exports = router;
