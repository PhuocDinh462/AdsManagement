const express = require("express");
const accountController = require("../controllers/accountController");
const validationAccount = require("../middlewares/validationAccount.middleware")

const router = express.Router();

router.get("/get_infor", accountController.getInforAccount);
router.patch("/update_account", accountController.updateAccountInfor);
router.patch("/change_password", accountController.changePassword)


module.exports = router;