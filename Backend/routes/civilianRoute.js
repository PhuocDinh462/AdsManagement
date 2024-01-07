const express = require('express');
const civilianController = require('../controllers/civilianController');
const recaptcha = require('../middlewares/recaptcha/recaptcha.middleware.js');

const router = express.Router();

router.get('/', civilianController.getAllDistrictWard);
router.get('/adsBoard', civilianController.getAllAdsBoard);
router.get('/getReport', civilianController.getAllReport);
router.get('/adsType', civilianController.getAdvertisementTypes);
router.post('/report', recaptcha, civilianController.createReport);
// router.post('/report', civilianController.createReport);

module.exports = router;
