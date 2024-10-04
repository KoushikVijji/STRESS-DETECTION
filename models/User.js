const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter a Username.'],
    unique: true,
    minlength: [3, "Minimum username length is 3 characters."],
    maxlength: [15, "Maximum username length is 15 characters."],
    match: [/^[a-zA-Z0-9_]+$/, "Username should contain only letters, numbers, and underscores."]
  },
  email: {
    type: String,
    required: [true, "Please enter an Email."],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid Email."],
  },
  password: {
    type: String,
    required: [true, "Please enter a Password."],
    minlength: [6, "Minimum password length is 6 characters."],
  },
  role: {
    type: [String],
    default: ["user"],
    enum: ["user", "admin"]
  }
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);

    if(auth) {
      return user;
    }
    throw Error('Incorrect Password');
  }
  throw Error('Email address does not exist');
};

const User = mongoose.model("user", userSchema);

module.exports = User;
