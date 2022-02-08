const mongoose = require("mongoose");

const Logs = mongoose.model(
  "Logs",
  new mongoose.Schema({
    evaluationId: String,
    actionCreator: {},
    actionMessage: String,
    actionTarget: {},
  })
);

module.exports = { Logs };
