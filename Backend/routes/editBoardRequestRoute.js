const express = require("express");
const editBoardRequestController = require("../controllers/editBoardRequestController");


const router = express.Router();

router.post("/create", editBoardRequestController.createEditBoardRequest)


module.exports = router;