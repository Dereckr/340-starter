const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
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

/* ************************
 * Build the Classification list view HTML
 ************************** */

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 *  Check Account Level
 * ************************************ */
Util.checkAccountLevel = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        if (accountData.account_type === "Client") {
          res.locals.accountData = accountData;
          res.locals.accessLevel = 1;
        }
        if (accountData.account_type === "Employee") {
          res.locals.accountData = accountData;
          res.locals.accessLevel = 2;
        }
        if (accountData.account_type === "Admin") {
          res.locals.accountData = accountData;
          res.locals.accessLevel = 3;
        }
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Level
 * ************************************ */
Util.checkAccessLevel = (req, res, next) => {
  if (res.locals.accessLevel > 1) {
    next();
  } else {
    req.flash("notice", "Unauthorized");
    return res.redirect("/account/login");
  }
};

Util.checkifUser = (req, res, next) => {
  if (res.locals.accessLevel == 1) {
    next();
  } else {
    req.flash("notice", "Unauthorized");
    return res.redirect("/account/login");
  }
};

/* **************************************
 * Build new review display
 * ************************************ */
Util.addNewReview = async function (data) {
  let review;
  if (data.length > 0) {
    review = '<div id="review-display">';
    data.forEach((item) => {
      review += `<div id="description">
          <div ></div>
          <div>
          <h1>Customer Reviews</h1>
          <h2>${item.review_id}</h2>
          <p>$${new Intl.NumberFormat("en-US").format(item.review_date)}</p>
          <p>${item.review_text}</p>
        </div>`;
    });
    review += "</div>";
  } else {
    review = '<p class="notice"> Sorry, there are no reviews.</p>';
  }
  return review;
};

module.exports = Util;
