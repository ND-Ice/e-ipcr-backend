const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const facultySchema = new mongoose.Schema({
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

facultySchema.methods.generateAuthToken = function () {
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

const Faculties = mongoose.model("Faculties", facultySchema);

function validate(faculty) {
  // validation schema
  const schema = Joi.object({
    email: Joi.string().email().required(),
    dept: Joi.string().required(),
  }).unknown(true);
  // validation
  return schema.validate(faculty);
}

module.exports = { Faculties, validate };
