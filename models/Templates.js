const mongoose = require("mongoose");

const Templates = mongoose.model(
  "Templates",
  new mongoose.Schema({
    dateGenerated: { type: String, default: Date.now() },
    coreFunctionsMeasure: Number,
    supportFunctionsMeasure: Number,
    comments: { type: String, default: "" },
    coreFunctions: [],
    supportFunctions: [],
    target: String,
    targetYear: String,
    generatedBy: {
      createdBy: {},
      signature: String,
    },
    ratings: {
      average: { type: String, default: null },
    },
  })
);

module.exports = { Templates };
