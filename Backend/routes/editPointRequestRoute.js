const express = require("express");
const editPointRequestController = require("../controllers/editPointRequestController");


const router = express.Router();

router.post("/create", editPointRequestController.createEditPointRequest)


module.exports = router;