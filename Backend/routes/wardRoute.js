const express = require('express');
const wardController = require('../controllers/wardController');
const emailController = require('../controllers/emailController');
const router = express.Router();
const validate = require('../middlewares/validation/validationSchema');
const updateReportStatus = require('../schemas/updateReportStatus.json');

router.get('/getAdSpotsByWardId/:id', wardController.getAdSpotsByWardId);
router.get('/getInfoByPointId/:id', wardController.getInfoByPointId);
router.get('/getAdBoardsBySpotId/:id', wardController.getAdBoardsBySpotId);
router.get('/getReportListsByWardId/:id', wardController.getReportListsByWardId);
router.get('/getReportDetailsByPointId/:id', wardController.getReportDetailsByPointId);
router.post('/replyReport', emailController.replyReport);
router.patch('/updateReportStatus', validate(updateReportStatus), wardController.updateReportStatus);

module.exports = router;
