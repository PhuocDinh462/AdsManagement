const express = require('express');
const civilianController = require('../controllers/civilianController');
const recaptcha = require('../middlewares/recaptcha/recaptcha.middleware.js');

const router = express.Router();

router.get('/', civilianController.getAllDistrictWard);
router.post('/report', recaptcha, civilianController.createReport);

module.exports = router;
