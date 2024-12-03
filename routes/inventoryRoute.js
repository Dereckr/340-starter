// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// const routerCar = new express.Router();
const invController = require("../controllers/invController");
//route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);
//route to build car specifications
router.get("/detail/:carId", utilities.handleErrors(invController.buildByCar));
//route for error
router.get("/errorTrigger", utilities.handleErrors(invController.errorTrigger));
// Vehicle management
router.get("/", utilities.handleErrors(invController.buildManagement));

router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

router.post(
  "/addClassification",
  regValidate.addClassicationRules(),
  regValidate.checkAddData,
  utilities.handleErrors(invController.addClassification)
);

// add inventory
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);

router.post(
  "/addInventory",
  regValidate.addInventoryRules(),
  regValidate.checkAddInventory,
  utilities.handleErrors(invController.addInventory)
);
module.exports = router;
