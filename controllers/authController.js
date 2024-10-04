const Image = require("../models/Image");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
  let errors = { username: "", email: "", password: "" };

  if (err.message === "Incorrect Password") {
    errors.password = "Incorrect Password";
  }

  if (err.message === "Email address does not exist") {
    errors.email = "Email address does not exist";
  }

  if (err.code === 11000) {
    if (err.keyValue.email) {
      errors.email = "Entered email is already registered.";
    }
    if (err.keyValue.username) {
      errors.username = "Username is already taken.";
    }
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "node authentication secret", {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports.upload_get = async (req, res) => {
  res.render("upload");
};

module.exports.signup_post = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.upload_post = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const { file } = req;

  try {
    const userId = res.locals.user._id; 
    let userImages = await Image.findOne({ userId });

    if (!userImages) {
      userImages = new Image({
        userId,
        images: []
      });
    }

    userImages.images.push({
      filename: file.originalname,
      uploadedAt: Date.now(), 
    });

    await userImages.save();

    res.status(200).redirect('/upload');
  } catch (err) {
    res.status(500).json({ message: "Error uploading image", error: err.message });
  }
};
