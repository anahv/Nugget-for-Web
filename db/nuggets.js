const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

mongoose
  .connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .catch(error => console.error("Connection error" + error.message));

const db = mongoose.connection;

const myNuggetSchema = new mongoose.Schema({
  title: String,
  content: String,
  example: String,
  reminderOn: Boolean,
  reminder: String,
  label: String,
  date: String,
  color: String
});

const Nugget = mongoose.model("myNuggets", myNuggetSchema);

filterNuggets = async (req, res) => {
  // let searchText = req.query.search
  let searchText = req.params.searchText;
  const filteredNuggets = await Nugget.find({
    content: { $regex: searchText, $options: "ix" }
  });
  if (!filteredNuggets) {
    return res
      .status(400)
      .json({ success: false, error: err, message: "no nuggets found" });
  }
  res.status(200).json({ success: true, data: filteredNuggets });
};

// Routes

const router = express.Router();

router.get("/search/:searchText", filterNuggets);

module.exports = {
  db,
  myNuggetSchema,
  filterNuggets,
  router,
  Nugget
};
