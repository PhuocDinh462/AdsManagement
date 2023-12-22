const express = require('express');
const cadreController = require('../controllers/cadreController');
const cadreFormController = require('../controllers/cadreFormController');
const cadreAdsPointController = require('../controllers/cadreAdsPointController');
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
router.post('/addAdsPoint', cadreAdsPointController.addAdsPoint);
router.put('/updateAdsPoint', cadreAdsPointController.updateAdsPoint);
router.delete('/deleteAdsPoint', cadreAdsPointController.deleteAdsPoint);

module.exports = router;

