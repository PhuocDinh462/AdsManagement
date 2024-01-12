const express = require('express');
const wardController = require('../controllers/wardController');
const emailController = require('../controllers/emailController');
const router = express.Router();
const validate = require('../middlewares/validation/validationSchema');
const validationLicenseReq = require('../middlewares/validation/LicenseReq.middleware');
const {
  createLicensingRequest,
  getAllLicenseRequestByWard,
  getAllLicenseRequest,
  updateStatusLicenseRequest,
  getAllLicenseRequestByWardId,
} = require('../controllers/license.controller');

// Schema validate
const updateReportStatusSchema = require('../schemas/updateReportStatus.json');
const getReportDetailsByLatLngSchema = require('../schemas/getReportDetailsByLatLng.json');
const replyReportSchema = require('../schemas/replyReport.json');

router.get('/getAdSpotsByWardId/:id', wardController.getAdSpotsByWardId);
router.get('/getInfoByPointId/:id', wardController.getInfoByPointId);
router.get('/getAdBoardsBySpotId/:id', wardController.getAdBoardsBySpotId);
router.get('/getReportListsByWardId/:id', wardController.getReportListsByWardId);
router.get('/getReportDetailsByPointId/:id', wardController.getReportDetailsByPointId);
router.post(
  '/getReportDetailsByLatLng',
  validate(getReportDetailsByLatLngSchema),
  wardController.getReportDetailsByLatLng
);
router.post('/replyReport', validate(replyReportSchema), emailController.replyReport);
router.patch('/updateReportStatus', validate(updateReportStatusSchema), wardController.updateReportStatus);
router.get('/getAdBoardByBoardId/:id', wardController.getAdBoardByBoardId);
router.post(
  '/getNumberOfReportsByLatLng',
  validate(getReportDetailsByLatLngSchema),
  wardController.getNumberOfReportsByLatLng
);
router.post('/license/create-license', validationLicenseReq, createLicensingRequest);
router.get('/license', getAllLicenseRequest);
router.get('/license-by-ward', getAllLicenseRequestByWard);
router.get('/license-by-ward-id/:ward_id', getAllLicenseRequestByWardId);
router.patch('/license/:licensingId', updateStatusLicenseRequest);
router.get('/getAdSpotsListByWardId/:id', wardController.getAdSpotsListByWardId);
router.get('/get_wards_managing', wardController.getAllWardsByDistrictManager);

module.exports = router;
