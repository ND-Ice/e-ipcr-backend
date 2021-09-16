const express = require("express");
const _ = require("lodash");
const router = express.Router();

const { Evaluations, validateEvaluation } = require("../models/Evaluations");

// get all evaluations
router.get("/", async (req, res) => {
  const evaluations = await Evaluations.find({});
  if (!evaluations) return res.status(400).send("No Evaluation yet");
  return res.send(evaluations);
});

// create evaluation
router.post("/", async (req, res) => {
  const { error } = validateEvaluation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let evaluations = await Evaluations.findOne({ title: req.body.title });
  if (evaluations)
    return res
      .status(400)
      .send("An evaluation with the same title is already posted");

  evaluations = new Evaluations(
    _.pick(req.body, ["title", "desc", "due", "dept"])
  );
  await evaluations.save();
  res.send(evaluations);
});

module.exports = router;
