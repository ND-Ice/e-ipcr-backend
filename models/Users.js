const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
  contact: String,
  dept: String,
  isActivated: { type: String, default: false },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.SECRET_TOKEN
  );
  return token;
};

const Users = mongoose.model("Users", userSchema);

function validateUser(user) {
  // validation schema
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(10),
    dept: Joi.string().required(),
  });
  // validation
  return schema.validate(user);
}

module.exports = { Users, validateUser };
