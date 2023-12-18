const express = require('express');
const wardController = require('../controllers/wardController');
const router = express.Router();

router.get('/getAdSpotsByWardId/:id', wardController.getAdSpotsByWardId);
router.get('/getAdBoardsBySpotId/:id', wardController.getAdBoardsBySpotId);

module.exports = router;
