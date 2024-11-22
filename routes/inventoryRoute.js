// Needed Resources
const express = require("express");
const router = new express.Router();
// const routerCar = new express.Router();
const invController = require("../controllers/invController");
//route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
//route to build car specifications
router.get("/detail/:carId", invController.buildByCar);

module.exports = router;
