const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

//route to build Login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

module.exports = router;
