const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();

const { validateUser, Users } = require("../models/Users");
const { ValidUsers } = require("../models/ValidUsers");
const sendMail = require("../utils/sendMail");

// register user
router.post("/add", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await Users.findOne({ email: req.body.email });
  if (user) return res.status(400).send("This email already been used");

  const validUser = await ValidUsers.findOne({
    email: req.body.email,
    name: req.body.name,
  });

  if (!validUser)
    return res.status(400).send("This user is not a faculty in earist");

  user = new Users(_.pick(req.body, ["email", "password", "name"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  sendMail(
    user.email,
    user.id,
    process.env.REG_VERIFY,
    "Account Activation",
    "Activate"
  );

  res.send(user);
});

// verify account
router.get("/verify/:id", async (req, res) => {
  const user = await Users.findOne({ id: req.params.id });
  if (!user) return res.status(404).send("User not found");
  user.isActivated = true;

  await user.save();
  res.send("Activated");
});

// retrieve account send email verification
router.post("/recovery", async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email");
  sendMail(
    user.email,
    user.id,
    process.env.RECOVERY,
    "Account Recovery",
    "Recover"
  );
  return res.send("check you email");
});

// change password on recovery
router.patch("/recovery/:id", async (req, res) => {
  const user = await Users.findOne({ id: req.params.id });
  if (!user) return res.status(400).send("Invalid user");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);

  await user.save();
  return res.send(user);
});

module.exports = router;
