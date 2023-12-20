const express = require("express");
const editBoardRequestController = require("../controllers/editBoardRequestController");

const requestEditValidation = require("../middlewares/validation/validationEditRequest.middleware")

const router = express.Router();

router.post("/create", requestEditValidation.BoardRequest, editBoardRequestController.createEditBoardRequest)


module.exports = router;