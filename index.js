const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

// routes
const auth = require("./routes/auth");
const evaluations = require("./routes/evaluations");
const deans = require("./routes/deans");
const faculties = require("./routes/faculties");

const PORT = process.env.PORT || 5000;
const DB_CONNECTION = process.env.DB_CONNECTION;

app.use(express.json());
app.use(cors());
app.use("/api/deans", deans);
app.use("/api/faculties", faculties);
app.use("/api/auth", auth);
app.use("/api/evaluations", evaluations);

mongoose
  .connect(DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log("couldn't connect to mongo DB ", err));

app.listen(PORT, (req, res) => {
  console.log(`app is listening in port ${PORT}`);
});
