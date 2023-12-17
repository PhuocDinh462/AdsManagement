const express = require('express');
const cardeController = require('../controllers/cardeController');
const router = express.Router();

router.get('/', cardeController.getAllDistrictWard);
router.get('/districts', cardeController.getDistricts);
router.post('/createAddress', cardeController.createAddress);
router.put('/updateAddress', cardeController.updateAddress);
router.delete('/deleteAddress', cardeController.deleteAddress);

module.exports = router;

