const express = require("express");
const advertisementTypeController = require("../controllers/advertisementTypeController");


const router = express.Router();

router.get("/", advertisementTypeController.getAll)


module.exports = router;