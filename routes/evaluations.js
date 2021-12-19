const express = require("express");
const _ = require("lodash");
const router = express.Router();

const { Evaluations, validateEvaluation } = require("../models/Evaluations");
const checkDue = require("../utils/checkDue");

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
  return res.send(evaluation);
});

// get ongoing evaluations
router.get("/filter/ongoing", async (req, res) => {
  const ongoing = await Evaluations.find({ isFinished: false });
  return res.send(ongoing);
});

// get past evaluations
router.get("/filter/past", async (req, res) => {
  const past = await Evaluations.find({ isFinished: true });
  return res.send(past);
});

// get ongoing evaluations for specific department
router.get("/filter/ongoing/:dept", async (req, res) => {
  const ongoing = await Evaluations.find({
    isFinished: false,
    dept: req.params.dept,
  });
  return res.send(ongoing);
});

// get pas evaluations for specific department
router.get("/filter/past/:dept", async (req, res) => {
  const past = await Evaluations.find({
    isFinished: true,
    dept: req.params.dept,
  });
  return res.send(past);
});

// get evaluations by department
router.get("/department/:deparmtment", async (req, res) => {
  const evaluations = await Evaluations.find({ dept: req.params.deparmtment });
  return res.send(evaluations);
});

// edit evaluations or extend
router.put("/:id", async (req, res) => {
  const evaluation = await Evaluations.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  if (!evaluation)
    return res.status(400).send("This evaluation does not exist");

  const isDue = checkDue("2021-09-17", "2021-09-20");

  if (!isDue) return res.send(evaluation);
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
