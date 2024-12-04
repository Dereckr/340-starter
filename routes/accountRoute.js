const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

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

// // Process the login attempt
// router.post("/login", (req, res) => {
//   res.status(200).send("login process");
// });

//route to process login data
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
);

router.get("/", utilities.handleErrors(accountController.buildAccountLogin));

module.exports = router;
