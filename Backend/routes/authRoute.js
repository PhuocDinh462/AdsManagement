const express = require("express");
const authController = require("../controllers/authController");
const emailController = require("../controllers/emailController")
const validationCreateAccount = require("../middlewares/validationCreateAccount.middleware")
const router = express.Router();

router.post("/send_otp", emailController.createOTP);
router.post("/create", validationCreateAccount, authController.createAccount);
router.post("/login", authController.login);

module.exports = router;