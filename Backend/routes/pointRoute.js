const express = require("express");
const pointController = require("../controllers/pointController");

const router = express.Router();

router.get("/get_point/:id", pointController.getInforPoint)
router.get("/get_points_by_manager", pointController.getPointsByManager)


module.exports = router;