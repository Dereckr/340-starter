const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ************************
 * Build inventory by classification view
 ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClasifficationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ************************
 * Build car Specs view
 ************************** */

invCont.buildByCar = async function (req, res, next) {
  const car_id = req.params.carId;
  const data = await invModel.getCarById(car_id);
  const carSpecs = await utilities.buildCarSpecs(data);
  console.log(carSpecs);
  let nav = await utilities.getNav();
  const carYear = data.inv_year;
  const carMake = data.inv_make;
  const carModel = data.inv_model;
  res.render("./inventory/carSpecs", {
    title: carYear + " " + carMake + " " + carModel,
    nav,
    carSpecs,
  });
};

module.exports = invCont;
