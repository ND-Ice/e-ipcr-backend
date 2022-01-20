const express = require("express");
const MonkeyLearn = require("monkeylearn");
const router = express.Router();

const { Templates } = require("../models/Templates");

router.post("/", async (req, res) => {
  const {
    coreFunctionsMeasure,
    supportFunctionsMeasure,
    coreFunctions,
    supportFunctions,
    target,
    targetYear,
    generatedBy,
  } = req.body;

  let template = await Templates.findOne({ targetYear, target });
  if (template) return res.status(400).send("This template is already existed");

  template = new Templates({
    coreFunctionsMeasure,
    supportFunctionsMeasure,
    coreFunctions,
    supportFunctions,
    target,
    targetYear,
    generatedBy,
  });

  await template.save();
  return res.send(template);
});

router.get("/", async (req, res) => {
  const templates = await Templates.find();
  return res.send(templates);
});

// classify sentiment
router.post("/analyzer", async (req, res) => {
  const { accomplishment } = req.body;
  const ml = new MonkeyLearn(process.env.API_KEY);
  let model_id = "cl_pi3C7JiL";
  let data = [accomplishment];

  try {
    ml.classifiers.classify(model_id, data).then((response) => {
      return res.send(response.body);
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.post("/upload-classifier", async (req, res) => {
  const { tagName, accomplishment } = req.body;
  const ml = new MonkeyLearn(process.env.API_KEY);
  let model_id = "cl_8HETQm6X";

  let data = [
    {
      text: accomplishment,
      tags: [tagName],
    },
  ];

  try {
    ml.classifiers.upload_data(model_id, data).then((response) => {
      res.send(response.body);
    });
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;
