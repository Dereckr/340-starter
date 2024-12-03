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
    errors: null,
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
    errors: null,
  });
};

invCont.errorTrigger = async function (req, res, next) {
  let nav = await utilities.getNav();
  throw new Error("Throw makes it go boom");
  res.render("inventory/errorTrigger", {
    title: "Error trigger",
    nav,
  });
};

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  });
};

// Build Add Classification
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/addClassification", {
    title: "Add new Classification",
    nav,
    errors: null,
  });
};

// Build Add Classification
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("inventory/addInventory", {
    title: "Add new Car",
    nav,
    classificationList,
    errors: null,
  });
};

/* ****************************************
 *  Process add
 * *************************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const addResult = await invModel.addClassification(classification_name);
  let nav = await utilities.getNav();

  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, your classification, ${classification_name}, was added.`
    );
    res.status(201).render("inventory/management", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("/inventory/addClassification", {
      title: "Add new classification",
      nav,
      errors: null,
    });
  }
};

invCont.addInventory = async function (req, res) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;
  console.log(inv_color);
  console.log(classification_id);

  const addCar = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );
  let nav = await utilities.getNav();

  if (addCar) {
    req.flash(
      "notice",
      `Congratulations, your classification, ${inv_make} ${inv_model}, was added.`
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("/inventory/addInventory", {
      title: "Add new classification",
      nav,
      errors: null,
    });
  }
};

module.exports = invCont;
