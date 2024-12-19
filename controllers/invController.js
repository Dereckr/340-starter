const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");

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
  const accountData = parseInt(res.locals.accountData);

  const carSpecs = await utilities.buildCarSpecs(data, accountData);
  const reviewData = await invModel.getReviewByInvId(car_id);
  const reviews = await utilities.buildReviewList(reviewData);
  let nav = await utilities.getNav();
  const carYear = data.inv_year;
  const carMake = data.inv_make;
  const carModel = data.inv_model;
  res.render("./inventory/carSpecs", {
    title: carYear + " " + carMake + " " + carModel,
    nav,
    carSpecs,
    reviews,
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

/* ************************
 * Build vehicle Management view
 * Assignment 4, Task 1
 ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
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

// Build Add Inventory
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClasifficationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getCarById(inv_id);
  let classificationList = await utilities.buildClassificationList(
    itemData.classification_id
  );
  let itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteConfirmationView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getCarById(inv_id);
  // let classificationList = await utilities.buildClassificationList(
  //   itemData.classification_id
  // );
  let itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id);
  const { inv_make, inv_model, inv_year, inv_price } = req.body;
  const deleteResult = await invModel.deleteInventory(inv_id);

  if (deleteResult) {
    req.flash("notice", `The vehicle was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).redirect(`inv/delete/${inv_id}`, {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    });
  }
};

/* ************************
 * Post Review
 ************************** */
invCont.review = async function (req, res, next) {
  // const inv_id = parseInt(req.params.inv_id);
  const account_id = parseInt(res.locals.accountData.account_id);
  const { review_text } = req.body;
  const inv_id = req.params.carId;

  console.log(account_id);
  console.log(review_text);
  console.log(inv_id);

  const data = await invModel.getCarById(inv_id);
  const addReview = await invModel.addReview(
    review_text,
    data.inv_id,
    account_id
  );
  const carSpecs = await utilities.buildCarSpecs(data, account_id);
  const addNewReview = await utilities.addNewReview(data);

  let nav = await utilities.getNav();
  const carYear = data.inv_year;
  const carMake = data.inv_make;
  const carModel = data.inv_model;

  if (addReview) {
    req.flash("notice", `Congratulations, your review was added.`);
    res.status(201).render("inventory/carSpecs", {
      title: carYear + " " + carMake + " " + carModel,
      nav,
      carSpecs,
      addNewReview,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).redirect("/inv/carSpecs", {
      title: "Failed",
      nav,
      errors: null,
    });
  }
};

invCont.editReview = async function (req, res, next) {
  const review_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getReviewById(review_id);
  res.render("inventory/edit-review", {
    title: "Edit Review",
    nav,
    errors: null,
    review_id: itemData.inv_id,
    review_text: itemData.review_text,
    inv_id: itemData.inv_id,
    account_id: itemData.account_id,
  });
};

invCont.updateReview = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { review_id, review_text, inv_id, account_id } = req.body;
  const updateResult = await invModel.updateReview(
    review_id,
    review_text,
    inv_id,
    account_id
  );

  if (updateResult) {
    req.flash("notice", `The review was successfully updated.`);
    res.redirect("/");
  } else {
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-review", {
      title: "Edit Review",
      nav,
      errors: null,
      review_id,
      review_text,
      inv_id,
      account_id,
    });
  }
};

/* ***************************
 *  Build delete Review view
 * ************************** */
invCont.buildDeleteReviewView = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getReviewById(review_id);
  // let classificationList = await utilities.buildClassificationList(
  //   itemData.classification_id
  // );
  res.render("inventory/deleteReview-confirm", {
    title: "Delete Review",
    nav,
    errors: null,
    review_id: itemData.review_id,
    review_text: itemData.review_text,
    inv_id: itemData.inv_id,
    acoount_id: itemData.account_id,
  });
};

invCont.deleteReview = async function (req, res, next) {
  let nav = await utilities.getNav();
  const review_id = parseInt(req.body.review_id);
  const { review_text } = req.body;
  const deleteResult = await invModel.deleteReview(review_id);

  if (deleteResult) {
    req.flash("notice", `The Review was successfully updated.`);
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).redirect(`inv/deleteReview/${review_id}`, {
      title: "Delete Review",
      nav,
      errors: null,
      review_id,
      review_text,
    });
  }
};
module.exports = invCont;
