const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* ************************
 * Build the classification view HTML
 ************************** */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" ></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};
/* ************************
 * Build the Car Specs view HTML
 ************************** */
Util.buildCarSpecs = async function (data) {
  let carSpecs;
  if (data != undefined) {
    carSpecs = '<section id="carSpec">';
    carSpecs += '<div class="imgDiv">';
    carSpecs +=
      '<img src="' +
      data.inv_image +
      '" alt = "Image of ' +
      data.inv_make +
      " " +
      data.invModel +
      ' on CSE Motors">';
    carSpecs += "</div>";
    carSpecs += '<div class="specs"> ';
    carSpecs +=
      "<h2>" + data.inv_make + " " + data.inv_model + " Details </h2>";
    carSpecs += "<h2> Price: ";
    carSpecs +=
      "<span>$" +
      new Intl.NumberFormat("en-US").format(data.inv_price) +
      "</span>";
    carSpecs += "</h2>";
    carSpecs +=
      "<p> <strong>Description: </strong>" + data.inv_description + "</p>";
    carSpecs += "<p> <strong>Color: </strong> " + data.inv_color + "</p>";
    carSpecs +=
      "<p> <strong>Miles: </strong>" +
      new Intl.NumberFormat("En-US").format(data.inv_miles) +
      "</p>";
    carSpecs += "</div> ";
    carSpecs += "</section>";
  } else {
    carSpecs +=
      '<p class="notice">Sorry,that vehicle info could not be found</p>';
  }
  return carSpecs;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
