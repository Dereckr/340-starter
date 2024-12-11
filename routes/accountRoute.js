const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const validate = require("../utilities/account-validation");

//route to build Login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
//route to build Registration view
router.get(
  "/registration",
  utilities.handleErrors(accountController.buildRegister)
);
//route to process registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

//route to process login data
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
);

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountLogin)
);

// edit account

router.get(
  "/update/",
  utilities.handleErrors(accountController.buildEditAccountView)
);

router.post(
  "/update/",
  regValidate.accountUpdateRules(),
  regValidate.checkUpdateAccount,
  utilities.handleErrors(accountController.updateAccount)
);

router.post(
  "/update/",
  regValidate.passwordUpdateRules(),
  regValidate.checkPassword,
  utilities.handleErrors(accountController.passwordUpdate)
);

// LOGOUT
router.get("/logout", utilities.handleErrors(accountController.logout));

module.exports = router;
