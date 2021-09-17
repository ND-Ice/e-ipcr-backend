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

// update user
router.put("/:id", async (req, res) => {
  const user = await Users.findByIdAndUpdate(req.params.id, req.body);
  if (!user) return res.status(404).send("this user does not exist");
  res.send(user);
});

// get current user
router.get("/:id", async (req, res) => {
  const currentUser = await Users.findById(req.params.id);
  if (!currentUser) return res.status(404).send("User not found");
  res.send(currentUser);
});

// get all users
router.get("/", async (req, res) => {
  const user = await Users.find({});
  if (!user) return res.status(404).send("no users yet");
  res.send(user);
});

// delete users
router.delete("/:id", async (req, res) => {
  const deletedUser = await Users.findByIdAndDelete(req.params.id);
  if (!deletedUser)
    return res.status(404).send("User with the given id does not exist");

  return res.send(deletedUser);
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
