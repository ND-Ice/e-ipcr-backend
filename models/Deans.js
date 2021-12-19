const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { date } = require("joi");

const deansSchema = new mongoose.Schema({
  email: String,
  name: { firstName: String, lastName: String },
  password: String,
  dept: String,
  gender: String,
  birthDate: Date,
  image: { current: String, all: [] },
  address: {
    number: String,
    street: String,
    barangay: String,
    city: String,
  },
  contact: {
    email: String,
    cell: String,
  },
  timeStamp: { type: String, default: Date.now() },
  educationalAttainment: [],
});

deansSchema.methods.generateAuthToken = function () {
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

const Deans = mongoose.model("Deans", deansSchema);

function validate(dean) {
  // validation schema
  const schema = Joi.object({
    email: Joi.string().email().required(),
    dept: Joi.string().required(),
  }).unknown(true);
  // validation
  return schema.validate(dean);
}

module.exports = { Deans, validate };
