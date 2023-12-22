const express = require("express");
const accountController = require("../controllers/accountController");

const validationUpdate = require("../middlewares/validation/validationUpdateAccount.middleware")

const router = express.Router();

router.get("/get_infor", accountController.getInforAccount);
router.patch("/update_account", validationUpdate.AccountInfor, accountController.updateAccountInfor);
router.patch("/change_password", validationUpdate.AccountPassword, accountController.changePassword)


module.exports = router;