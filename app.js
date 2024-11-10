const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { checkUser } = require("./middleware/authMiddleware");
const authController = require('./controllers/authController');

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");

const dbURI =
  "mongodb+srv://koushik:koushik123@cluster0.gwhgn.mongodb.net/stress-detection";
mongoose
  .connect(dbURI)
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

app.get("*", checkUser);
app.get("/", authController.home);

app.use(authRoutes);
