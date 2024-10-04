const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "node authentication secret", (err, decodedToken) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(
      token,
      "node authentication secret",
      async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          let user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      }
    );
  } else {
    res.locals.user = null;
    next();
  }
};

const checkUserRole = (req, res, next) => {
  const currentuser = res.locals.user;

  if (!currentuser) {
    return res.redirect("/login");
  }

  if (currentuser.role && currentuser.role.includes("user")) {
    return next();
  }

  return res.status(403).send("Access denied. This page is for regular users only.");
};



const redirectIfLoggedIn = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(
      token,
      "node authentication secret",
      async (err, decodedToken) => {
        if (!err) {
          return res.redirect("/");
        }
        next();
      }
    );
  } else {
    next();
  }
};

module.exports = { requireAuth, checkUser, checkUserRole, redirectIfLoggedIn };
