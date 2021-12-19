const mongoose = require("mongoose");
const Joi = require("joi");

const currentDate = new Date().toLocaleDateString();

const Evaluations = mongoose.model(
  "Evaluations",
  new mongoose.Schema({
    title: { type: String },
    desc: { type: String },
    dept: { type: String },
    due: { type: String },
    timeStamp: { type: String, default: Date.now() },
    isFinished: { type: Boolean, default: false },
  })
);

function validateEvaluation(evaluation) {
  const schema = Joi.object({
    title: Joi.string().min(5).required(),
    due: Joi.date().required(),
    dept: Joi.string().required(),
    desc: Joi.string(),
  }).unknown(true);
  return schema.validate(evaluation);
}

module.exports = { Evaluations, validateEvaluation };
