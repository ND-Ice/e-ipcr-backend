const mongoose = require("mongoose");

const Response = mongoose.model(
  "Response",
  new mongoose.Schema({
    evaluationId: String,
    userId: String,
    user: {},
    templateId: String,
    feedback: {
      comments: { title: { type: String, default: "" }, list: [] },
      recommendations: { title: { type: String, default: "" }, list: [] },
    },
    isApproved: {
      approvedBy: {},
      approvedDate: String,
    },
    signatures: {
      userSignature: String,
      evaluatorSignature: String,
      hrSignature: String,
    },
    preparedBy: {},
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
