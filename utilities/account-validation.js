const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};

/* ************************
 * Registration Data Validation Rules
 ************************** */
validate.registrationRules = () => {
  return [
    //firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), //on error this message is sent

    //lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), //on error this message is sent

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() //refer to validator.js docs
      .withMessage("A valid email is required.") //on error this message is sent
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ************************
 * Registration Data Validation Rules
 ************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* ************************
 * Registration Login Rules
 ************************** */
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() //refer to validator.js docs
      .withMessage("A valid email is required.") //on error this message is sent
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (!emailExists) {
          throw new Error("Email doesnt exist. Please use different email");
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ************************
 * Registration Login Rules
 ************************** */
validate.checkLogData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

/* ************************
 * Add Classification Rules
 ************************** */
validate.addClassicationRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .matches(/^[a-zA-Z]+$/)
      .withMessage("A valid Classification name is required."), //on error this message is sent
  ];
};

validate.checkAddData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/addClassification", {
      errors,
      title: "Vehicle Management",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/* ************************
 * Add Inventory Rules
 ************************** */
validate.addInventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please select a classification name."), //on error this message is sent

    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage(
        "A valid make is required. Please input at least 3 characters."
      ), //on error this message is sent

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage(
        "A valid model is required. Please input at least 3 characters."
      ), //on error this message is sent

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A description is required."), //on error this message is sent

    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("A valid price is required."), //on error this message is sent

    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .matches(/^\d{4}$/)
      .withMessage("A valid year is required."),

    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .matches(/^[0-9]+$/)
      .withMessage("A valid mileage is required."),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("A color is required."),
  ];
};

validate.checkAddInventory = async (req, res, next) => {
  const {
    classification_name,
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
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("inventory/addInventory", {
      errors,
      title: "Add a New Car",
      nav,
      classificationList,
      classification_name,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

// checkUpdate Data errors directed to edit view
validate.checkUpdateInventory = async (req, res, next) => {
  const {
    classification_name,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    inv_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit" + inv_make + " " + inv_model,
      nav,
      classificationList,
      classification_name,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id,
    });
    return;
  }
  next();
};

/* ************************
 * Registration Data Validation Rules
 ************************** */
validate.accountUpdateRules = () => {
  return [
    //firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), //on error this message is sent

    //lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), //on error this message is sent

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() //refer to validator.js docs
      .withMessage("A valid email is required.") //on error this message is sent
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("It is the same email. Please try a different email");
        }
      }),
  ];
};

/* ************************
 * Update Password Rules
 ************************** */
validate.passwordUpdateRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ************************
 * Check Update
 ************************** */

validate.checkUpdateAccount = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update", {
      errors,
      title: "Update Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* ************************
 * Check Password
 ************************** */
validate.checkPassword = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update", {
      errors,
      title: "Update Password",
      nav,
    });
    return;
  }
  next();
};

/* ************************
 * Add Inventory Rules
 ************************** */
validate.addReviewRules = () => {
  return [
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A description is required."), //on error this message is sent
  ];
};

validate.checkReview = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/carSpecs", {
      errors,
      title: "New Review",
      nav,
    });
    return;
  }
  next();
};

module.exports = validate;
