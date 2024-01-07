const express = require('express');
const wardController = require('../controllers/wardController');
const emailController = require('../controllers/emailController');
const router = express.Router();
const validate = require('../middlewares/validation/validationSchema');
const updateReportStatus = require('../schemas/updateReportStatus.json');
const validationLicenseReq = require('../middlewares/validation/LicenseReq.middleware');
const {
  createLicensingRequest,
  getAllLicenseRequestByWard,
  updateStatusLicenseRequest,
  getAllLicenseRequestByWardId,
} = require('../controllers/license.controller');

router.get('/getAdSpotsByWardId/:id', wardController.getAdSpotsByWardId);
router.get('/getInfoByPointId/:id', wardController.getInfoByPointId);
router.get('/getAdBoardsBySpotId/:id', wardController.getAdBoardsBySpotId);
router.get('/getReportListsByWardId/:id', wardController.getReportListsByWardId);
router.get('/getReportDetailsByPointId/:id', wardController.getReportDetailsByPointId);
router.post('/getReportDetailsByLatLng', wardController.getReportDetailsByLatLng);
router.post('/replyReport', emailController.replyReport);
router.patch('/updateReportStatus', validate(updateReportStatus), wardController.updateReportStatus);
router.get('/getAdBoardByBoardId/:id', wardController.getAdBoardByBoardId);
router.post('/getNumberOfReportsByLatLng', wardController.getNumberOfReportsByLatLng);
router.post('/license/create-license', validationLicenseReq, createLicensingRequest);
router.get('/license-by-ward', getAllLicenseRequestByWard);
router.get('/license-by-ward-id/:ward_id', getAllLicenseRequestByWardId);
router.patch('/license/:licensingId', updateStatusLicenseRequest);
router.get('/getAdSpotsListByWardId/:id', wardController.getAdSpotsListByWardId);
router.get('/get_wards_managing', wardController.getAllWardsByDistrictManager);

module.exports = router;
