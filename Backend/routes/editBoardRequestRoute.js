const express = require("express");
const editBoardRequestController = require("../controllers/editBoardRequestController");

const requestEditValidation = require("../middlewares/validation/validationEditRequest.middleware")

const router = express.Router();

router.post("/create", requestEditValidation.BoardRequest, editBoardRequestController.createEditBoardRequest)
router.get("/get_board_request/:id", editBoardRequestController.getInforEditBoardRequest)


module.exports = router;