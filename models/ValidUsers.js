const mongoose = require("mongoose");
const Joi = require("joi");

const ValidUsers = mongoose.model(
  "ValidUsers",
  new mongoose.Schema({ name: String, email: String })
);

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.String().email().required(),
    name: Joi.String().min(5).required(),
  });
  return schema.validate(user);
}

module.exports = { ValidUsers, validateUser };
