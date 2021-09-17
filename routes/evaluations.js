const express = require("express");
const _ = require("lodash");
const moment = require("moment");
const router = express.Router();

const { Evaluations, validateEvaluation } = require("../models/Evaluations");

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

// close evaluation
router.patch("/:id", async (req, res) => {
  const evaluation = await Evaluations.findById(req.params.id);
  if (!evaluation)
    return res.status(400).send("This evaluations does not exist");

  evaluation.isFinished = true;
  await evaluation.save();
  res.send(evaluation);
});

// get all evaluations
router.get("/", async (req, res) => {
  const evaluations = await Evaluations.find({});
  if (!evaluations) return res.status(400).send("No Evaluation yet");
  return res.send(evaluations);
});

// get a single evaluation document
router.get("/:id", async (req, res) => {
  const evaluation = await Evaluations.findById(req.params.id);
  if (!evaluation) return res.status(404).send("Evaluation not found");
});

// edit evaluations or extend
router.put("/:id", async (req, res) => {
  const evaluation = await Evaluations.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  if (!evaluation)
    return res.status(400).send("This evaluation does not exist");

  const notDue = moment("2021-09-17").isSameOrBefore("2021-09-20");

  if (!notDue) return res.send(evaluation);
  evaluation.isFinished = false;
  await evaluation.save();
  res.send(evaluation);
});

// delete evaluation
router.delete("/:id", async (req, res) => {
  const evaluation = await Evaluations.findByIdAndDelete(req.params.id);
  if (!evaluation) return res.status(404).send("Evalution not found");
  res.send(evaluation);
});

module.exports = router;
