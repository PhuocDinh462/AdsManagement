const express = require('express');
const pointController = require('../controllers/pointController');

const router = express.Router();

router.get('/get_point/:id', pointController.getInforPoint);
router.get('/get_point_type/:id', pointController.getPointByTypeAndManage);
router.get('/get_points_by_manager', pointController.getPointsByManager);
router.get('/get_point_type/candre/:id', pointController.getPointByCandre);

module.exports = router;
