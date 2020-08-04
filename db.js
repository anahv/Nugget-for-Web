const mongoose = require("mongoose");
const express = require("express")

// Database connection

mongoose
  .connect(
    "mongodb+srv://ana-admin:Test123@cluster0.i4tx1.mongodb.net/nuggetDB?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .catch(error => console.error("Connection error" + error.message));

const db = mongoose.connection;

// Schema

const myNuggetSchema = new mongoose.Schema({
  title: String,
  content: String,
  example: String,
  reminderOn: Boolean,
  reminder: String,
  label: String
});

const Nugget = mongoose.model("myNuggets", myNuggetSchema);

// Database methods

createNugget = (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a Nugget"
    });
  }

  const nugget = new Nugget(body);

  if (!nugget) {
    return res.status(400).json({ success: false, error: err });
  }

  nugget
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: nugget._id,
        message: "Nugget created!"
      });
    })
    .catch(error => {
      return res.status(400).json({
        error,
        message: "Nugget not created!"
      });
    });
};

updateNugget = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update"
    });
  }

  Nugget.findOne({ _id: req.params.id }, (err, nugget) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "Nugget not found!"
      });
    }
    nugget.title = body.title;
    nugget.content = body.content
    nugget.example = body.example,
    nugget.reminderOn = body.reminderOn,
    nugget.reminder = body.reminder,
    nugget.label = body.label
    nugget
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: nugget._id,
          message: "Nugget updated!"
        });
      })
      .catch(error => {
        return res.status(404).json({
          error,
          message: "Nugget not updated!"
        });
      });
  });
};

deleteNugget = async (req, res) => {
  await Nugget.findOneAndDelete({ _id: req.params.id }, (err, nugget) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!nugget) {
      return res.status(404).json({ success: false, error: `Nugget not found` });
    }

    return res.status(200).json({ success: true, data: nugget });
  }).catch(err => console.log(err));
};

getNuggetById = async (req, res) => {
  await Nugget.findOne({ _id: req.params.id }, (err, nugget) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!nugget) {
      return res.status(404).json({ success: false, error: `Nugget not found` });
    }
    return res.status(200).json({ success: true, data: nugget });
  }).catch(err => console.log(err));
};

getNuggets = async (req, res) => {
  await Nugget.find({}, (err, nuggets) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!nuggets.length) {
      return res.status(404).json({ success: false, error: `Nugget not found` });
    }
    return res.status(200).json({ success: true, data: nuggets });
  }).catch(err => console.log(err));
};


// Routes

const router = express.Router()

router.post('/nuggets', createNugget)
router.put('/nuggets/:id', updateNugget)
router.delete('/nuggets/:id', deleteNugget)
router.get('/nuggets/:id', getNuggetById)
router.get('/nuggets', getNuggets)

module.exports = {
  db,
  createNugget,
  updateNugget,
  deleteNugget,
  getNuggets,
  getNuggetById,
  router
};
