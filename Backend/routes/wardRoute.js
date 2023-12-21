const express = require('express');
const wardController = require('../controllers/wardController');
const router = express.Router();

router.get('/getAdSpotsByWardId/:id', wardController.getAdSpotsByWardId);
router.get('/getInfoByPointId/:id', wardController.getInfoByPointId);
router.get('/getAdBoardsBySpotId/:id', wardController.getAdBoardsBySpotId);
router.get('/getReportListsByWardId/:id', wardController.getReportListsByWardId);

module.exports = router;
