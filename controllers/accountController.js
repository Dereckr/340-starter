const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ***********************
 * Deliver login view
 * ************************/

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ***********************
 * Deliver registration view
 * ************************/
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ***********************
 * Process registration
 * ************************/
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

// /* ***********************
//  * Process Login request
//  * ************************/
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

async function buildAccountLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Logged in",
    nav,
    errors: null,
  });
}

// Update Account View

async function buildEditAccountView(req, res, next) {
  const account_id = res.locals.accountData.account_id;
  let nav = await utilities.getNav();
  const itemData = await accountModel.getAccountById(account_id);
  let accountName = `${itemData.account_firstname} ${itemData.account_lastname}`;
  res.render("account/update", {
    title: "Edit " + accountName + "'s account",
    nav,
    errors: null,
    account_firstname: itemData.account_firstname,
    account_lastname: itemData.account_lastname,
    account_email: itemData.account_email,
    account_id: itemData.account_id,
  });
}

// Update Account
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;
  console.log(account_firstname);

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );

  if (updateResult) {
    const itemName =
      updateResult.account_firstname + " " + updateResult.account_lastname;
    req.flash("notice", ` ${itemName}'s account was successfully updated.`);
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("account/update", {
      title: "Account Update",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    });
  }
}

// update password

async function passwordUpdate(req, res) {
  let nav = await utilities.getNav();
  const { account_password } = req.body;
  const account_id = res.locals.accountData.account_id;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/update", {
      title: "Password Update",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.passwordUpdate(
    hashedPassword,
    account_id
  );
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, your password was updated. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/update", {
      title: "Password Update",
      nav,
      errors: null,
    });
  }
}

// LOGOUT

async function logout(req, res, next) {
  res.clearCookie("jwt");
  res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountLogin,
  logout,
  buildEditAccountView,
  updateAccount,
  passwordUpdate,
};
