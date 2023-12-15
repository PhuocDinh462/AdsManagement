const express = require("express");
const authController = require("../controllers/authController");
const validationAccount = require("../middlewares/validationAccount.middleware")
const router = express.Router();

router.post("/create", validationAccount, authController.createAccount);
router.post("/login", authController.login);

module.exports = router;