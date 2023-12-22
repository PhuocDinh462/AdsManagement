const express = require("express");
const editPointRequestController = require("../controllers/editPointRequestController");

const requestEditValidation = require("../middlewares/validation/validationEditRequest.middleware")
const router = express.Router();

router.post("/create", requestEditValidation.PointRequest, editPointRequestController.createEditPointRequest)
router.get("/get_point_request/:id", editPointRequestController.getInforEditPointRequest)


module.exports = router;