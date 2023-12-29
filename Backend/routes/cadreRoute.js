const express = require('express');
const cadreController = require('../controllers/cadreController');
const cadreFormController = require('../controllers/cadreFormController');
const cadreAdsPointController = require('../controllers/cadreAdsPointController');
const requestEditController = require('../controllers/cadreRequestEdit');
const cadreReportController = require('../controllers/cadreReportController');
const router = express.Router();

router.get('/', cadreController.getAllDistrictWard);
router.get('/districts', cadreController.getDistricts);
router.get('/wards', cadreController.getWards);
router.post('/createAddress', cadreController.createAddress);
router.put('/updateAddress', cadreController.updateAddress);
router.delete('/deleteAddress', cadreController.deleteAddress);

router.get('/form', cadreFormController.getType);
router.post('/addForm', cadreFormController.addFormType);
router.put('/updateForm', cadreFormController.updateForm);
router.delete('/deleteForm', cadreFormController.deleteForm);

router.get('/adsPoint', cadreAdsPointController.getAllAdsPoint);
router.get('/adsType', cadreAdsPointController.getAdvertisementTypes);
router.post('/addAdsPoint', cadreAdsPointController.addAdsPoint);
router.put('/updateAdsPoint', cadreAdsPointController.updateAdsPoint);
router.delete('/deleteAdsPoint', cadreAdsPointController.deleteAdsPoint);

router.get('/getRequestEditBoard', requestEditController.getRequestEditBoards);
router.get('/getRequestEditPoint', requestEditController.getRequestEditPoints);
router.get('/detailAdsBoard/:id', requestEditController.getDetailInforBoard);
router.get('/detailAdsPoint/:id', requestEditController.getDetailAdvertisingPoint);
router.put('/updateStatusEditReq/:id', requestEditController.updateStatus);

router.get('getAllReport', cadreReportController.getAllReport);

module.exports = router;

