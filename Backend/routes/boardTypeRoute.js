const express = require("express");
const boardTypeController = require("../controllers/boardTypeController");


const router = express.Router();

router.get("/", boardTypeController.getAll)


module.exports = router;