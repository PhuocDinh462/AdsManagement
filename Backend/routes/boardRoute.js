const express = require("express");
const boardController = require("../controllers/boardController");

const router = express.Router();

router.get("/get_board/:id", boardController.getInforBoard)


module.exports = router;