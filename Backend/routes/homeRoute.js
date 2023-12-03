const { Router } = require("express");
const express = require("express");
const homeController = require("../controllers/homeController");

const router = express.Router();

router.get("/", homeController.getAll);

module.exports = router;
