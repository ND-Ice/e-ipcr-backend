const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const { Faculties, validate } = require("../models/Faculties");
const generatePassword = require("../utils/generatePassword");
const sendMail = require("../utils/sendMail");

// create faculty account
router.post("/", async (req, res) => {
  const { email, dept, firstName, lastName } = req.body;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let faculty = await Faculties.findOne({ email, firstName, lastName, dept });
  if (faculty) return res.status(400).send("This user already exist.");

  const password = generatePassword(10);

  faculty = new Faculties({
    email,
    name: {
      firstName,
      lastName,
    },
    dept,
    password,
  });
  const salt = await bcrypt.genSalt(10);
  faculty.password = await bcrypt.hash(faculty.password, salt);

  await faculty.save();
  return res.send(faculty);
});

// get the current faculty account
router.get("/:id", async (req, res) => {
  const faculty = await Faculties.findById(req.params.id);
  if (!faculty) return res.status(400).send("This user does not exist.");
  return res.send(faculty);
});

// get all the faculties
router.get("/", async (req, res) => {
  const faculties = await Faculties.find();
  if (!faculties) return res.status(400).send("No record yet.");
  return res.send(faculties);
});

// get faculties by department
router.get("/department/:department", async (req, res) => {
  const faculties = await Faculties.find({ dept: req.params.department });
  return res.send(faculties);
});

// activate faculty account
router.get("/activate-account/:email", async (req, res) => {
  const { email } = req.params;

  const faculty = await Faculties.findOne({ email });
  if (!faculty) return res.status(400).send("This user does not exist.");

  const mail = sendMail(
    email,
    process.env.FACULTY_ACTIVATE,
    "Activate your account.",
    "Activate",
    faculty._id
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

  const faculty = await Faculties.findOne({ email });
  if (!faculty) return res.status(400).send("This user does not exist.");

  const mail = sendMail(
    email,
    process.env.FACULTY_RECOVERY,
    "Recover you account.",
    "Start Recovering",
    faculty._id
  );

  if (!mail)
    return res
      .status(400)
      .send("something went wrong. please try again later.");

  return res.send("Check your email for further details.");
});

// change password
router.patch("/change-password/:id", async (req, res) => {
  const faculty = await Faculties.findById(req.params.id);
  if (!faculty) return res.status(400).send("This user does not exist.");

  const salt = await bcrypt.genSalt(10);
  faculty.password = await bcrypt.hash(req.body.password, salt);

  await faculty.save();
  return res.send(faculty);
  d;
});

// delete dean account
router.delete("/:id", async (req, res) => {
  const faculty = await Faculties.findByIdAndDelete(req.params.id);
  if (!faculty) return res.status(400).send("User does not exist.");
  return res.send(faculty);
});

module.exports = router;
