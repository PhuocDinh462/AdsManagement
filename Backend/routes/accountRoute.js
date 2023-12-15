const express = require("express");
const accountController = require("../controllers/accountController");
const router = express.Router();

router.get("/get_infor", accountController.getInforAccount);
router.patch("/update_account", accountController.updateAccountInfor);


module.exports = router;