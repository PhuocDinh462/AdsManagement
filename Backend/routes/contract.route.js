const express = require('express');
const router = express.Router();

const contractController = require('../controllers/contract.controller');
const validationContract = require('../middlewares/validation/contract.middleware');

router.get('/', contractController.getContractById);
router.post('/create', validationContract, contractController.createContract);

module.exports = router;
