const mongoose = require("mongoose");

const Response = mongoose.model(
  "Response",
  new mongoose.Schema({
    evaluationId: String,
    userId: String,
    isApproved: {
      approvedBy: {},
      approvedDate: String,
      recommendation: String,
    },
    isRejected: {
      rejectedBy: {},
      reason: String,
    },
    dateSubmitted: { type: String, default: Date.now() },
    coreFunctionsMeasure: String,
    supportFunctionsMeasure: String,
    coreFunctions: [],
    supportFunctions: [],
    attachments: [],
    ratings: {
      average: { type: String, default: null },
    },
  })
);

module.exports = { Response };
