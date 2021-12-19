const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const { Deans, validate } = require("../models/Deans");
const generatePassword = require("../utils/generatePassword");
const sendMail = require("../utils/sendMail");

// create dean account
router.post("/", async (req, res) => {
  const { firstName, lastName, email, dept } = req.body;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let dean = await Deans.findOne({ email, firstName, lastName, dept });
  if (dean) return res.status(400).send("This user already exist");

  const password = generatePassword(10);

  dean = new Deans({
    email,
    name: { firstName, lastName },
    dept,
    password,
  });

  const salt = await bcrypt.genSalt(10);
  dean.password = await bcrypt.hash(dean.password, salt);

  await dean.save();
  return res.send(dean);
});

// get the current dean
router.get("/:id", async (req, res) => {
  const dean = await Deans.findById(req.params.id);
  if (!dean) return res.status(400).send("This user does not exist.");
  return res.send(dean);
});

// get all the deans
router.get("/", async (req, res) => {
  const deans = await Deans.find();
  if (!deans) return res.status(400).send("No records yet.");
  return res.send(deans);
});

// get deans by department
router.get("/department/:department", async (req, res) => {
  const deans = await Deans.find({ dept: req.params.department });
  return res.send(deans);
});

// activate dean account
router.get("/activate-account/:email", async (req, res) => {
  const { email } = req.params;

  const dean = await Deans.findOne({ email });
  if (!dean) return res.status(400).send("This user does not exist.");

  const mail = sendMail(
    email,
    process.env.DEAN_ACTIVATE,
    "Activate your account.",
    "Activate",
    dean._id
  );

  if (!mail)
    return res
      .status(400)
      .send("something went wrong. please try again later.");

  return res.send("Check your email for further details.");
});

// forgot password
router.get("/forgot-password/:email", async (req, res) => {
  const { email } = req.params;

  const dean = await Deans.findOne({ email });
  if (!dean) return res.status(400).send("This user does not exist.");

  const mail = sendMail(
    email,
    process.env.DEAN_RECOVERY,
    "Recover you Account.",
    "Start Recovering",
    dean._id
  );

  if (!mail)
    return res
      .status(400)
      .send("something went wrong. please try again later.");

  return res.send("Check your email for further details.");
});

// change password
router.patch("/change-password/:id", async (req, res) => {
  const dean = await Deans.findById(req.params.id);
  if (!dean) return res.status(400).send("This user does not exist.");

  const salt = await bcrypt.genSalt(10);
  dean.password = await bcrypt.hash(req.body.password, salt);

  await dean.save();
  return res.send(dean);
});

// delete dean account
router.delete("/:id", async (req, res) => {
  const dean = await Deans.findByIdAndDelete(req.params.id);
  if (!dean) return res.status(400).send("User does not exist");
  return res.send(dean);
});

module.exports = router;
