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
Util.buildCarSpecs = async function (data, accountData) {
  let carSpecs;
  // const validation = locals.accessLevel;
  // console.log(validation);
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
    carSpecs += "<div>";

    carSpecs +=
      '<form id="addReview" action="/inv/carSpecsReview/' +
      data.inv_id +
      '" method="post">';
    carSpecs += '<label for="username">Client Name</label>';
    carSpecs +=
      '<input="hidden" name="account_id" value="' +
      accountData.account_id +
      '" pattern="[0-9]"/>';
    carSpecs +=
      '<input="hidden" name="inv_id" value="' +
      data.inv_id +
      '" pattern="[0-9]"/>';
    carSpecs += '<label for="username">Client Name</label>';
    carSpecs +=
      '<input type="text" id="username" name="username" pattern="[a-zA-Z]+" required value="' +
      accountData.account_firstname +
      '" ><br>';
    ('<textarea id="review_text" name="review_text" rows="10" cols="50" required ></textarea>');
    carSpecs += '<input id="submit" type="submit" value="Submit Review">';

    carSpecs += "</form>";

    carSpecs += "</div>";

    // carSpecs += '<div class="review"></div>'
    // carSpecs += '<h3  <% if(locals.accessLevel === 1) { %> hidden <% }%>>You must <a href="../../account/login">login</a> to write a review</h3>'
    // carSpecs += '<% if(locals.accessLevel === 1) { %>'
    // carSpecs += '<form method="post" action="/inv/carSpecsReview/' + data.inv_id
    // +'"></form>'
    // carSpecs += 'label for="username">Client Name</label>'
    // carSpecs += '<input type="text" id="username" name="username" pattern="[a-zA-Z]+" required value="<%- locals.accountData.account_firstname %>" ><br>'
    // carSpecs += '<label for="review_text">Description</label><br>'
    // carSpecs += '<textarea id="review_text" name="review_text" rows="10" cols="50" required ><%= locals.review_text %></textarea><br>'
    // carSpecs += '<input type="submit" value="Submit Review"></input>'
    // carSpecs += '<input type="hidden" name="inv_id"'
    // carSpecs +='<% if(locals.inv_id) { %> value="<%= locals.inv_id %>"<% } %>>'
    // carSpecs += '<input type="hidden" name="account_id"'
    // carSpecs += '<% if(locals.account_id) { %> value="<%= locals.account_id %>"<% } %>>'
    // carSpecs += ' </div>'
    // carSpecs += '<% }%></br>'
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

// REVIEW

Util.buildReviewList = async function (data) {
  // let reviewDisplay = document.getElementById("reviewDisplay");
  // Set up the table labels
  let dataTable = "<table>";
  dataTable += "<thead>";
  dataTable += "<tr><th>My Reviews</th><td>&nbsp;</td><td>&nbsp;</td></tr>";
  dataTable += "</thead>";
  // Set up the table body
  dataTable += "<tbody>";
  // Iterate over all vehicles in the array and put each in a row
  data.forEach(function (element) {
    console.log(element.inv_id + ", " + element.inv_model);
    dataTable += `<tr><td>${element.review_text}</td>`;
    dataTable += `<td>Reviewed  on ${element.review_date}</td>`;
    dataTable += `<td><a href='/inv/editReview/${element.review_id}' title='Click to update'>Modify</a></td>`;
    dataTable += `<td><a href='/inv/deleteReview/${element.review_id}' title='Click to delete'>Delete</a></td></tr>`;
  });
  dataTable += "</tbody>";
  dataTable += "</table>";
  // Display the contents in the Inventory Management view
  return dataTable;
};

module.exports = Util;
