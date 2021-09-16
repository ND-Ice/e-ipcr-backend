const express = require("express");
const brcypt = require("bcrypt");
const router = express.Router();

const { Users } = require("../models/Users");

router.get("/", async (req, res) => {
  const user = await Users.findOne({
    email: req.body.email,
    isActivated: true,
  });

  if (!user) return res.status(400).send("Invalid Credentials");
  const validPassword = await brcypt.compare(req.body.password, user.password);

  if (!validPassword)
    return res.status(400).send("Invalid username or Password");

  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
