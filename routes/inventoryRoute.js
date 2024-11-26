// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");

// const routerCar = new express.Router();
const invController = require("../controllers/invController");
//route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);
//route to build car specifications
router.get("/detail/:carId", invController.buildByCar);
//route for error
router.get("/errorTrigger", utilities.handleErrors(invController.errorTrigger));

module.exports = router;
