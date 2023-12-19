const express = require("express");
const googleOAuthController = require("../controllers/googleOAuthController")
const router = express.Router();


router.get("/api/sessions/oauth/google", googleOAuthController.googleOAuthHandler)

module.exports = router;