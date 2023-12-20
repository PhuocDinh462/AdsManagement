const express = require("express");
const pointController = require("../controllers/pointController");

const router = express.Router();

router.get("/get_point/:id", pointController.getInforPoint)


module.exports = router;