const express = require("express");
const router = express.Router();

const { Templates } = require("../models/Templates");

router.post("/", async (req, res) => {
  const {
    coreFunctionsMeasure,
    supportFunctionsMeasure,
    coreFunctions,
    supportFunctions,
  } = req.body;

  const template = new Templates({
    coreFunctionsMeasure,
    supportFunctionsMeasure,
    coreFunctions,
    supportFunctions,
  });

  await template.save();
  return res.send(template);
});

router.get("/", async (req, res) => {
  const templates = await Templates.find();
  return res.send(templates);
});

module.exports = router;
