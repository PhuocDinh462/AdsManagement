const express = require("express");
const authController = require("../controllers/authController");
const validationCreateAccount = require("../middlewares/validationCreateAccount.middleware")
const router = express.Router();

router.post("/create", validationCreateAccount, authController.createAccount);
router.post("/login", authController.login);

module.exports = router;