const express = require('express');
const logController = require('../controllers/logController');
const validate = require('../middlewares/validation/validationSchema');

const schema = require('../schemas/log.json');

const router = express.Router();

router.get('/', logController.getAllLogs);
router.post('/search', validate(schema), logController.searchDetailLog);

module.exports = router;
