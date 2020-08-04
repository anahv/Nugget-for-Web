const express = require('express');
const app = express();
const cors = require("cors")
const port = process.env.PORT || 3001;
app.use(express.static(__dirname + "/build"));
const bodyParser = require("body-parser")

const {db, router} = require("./db")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

db.on("error", console.error.bind(console, "Mongo DB connection error: "))

app.get('/', (req, res) => {
   res.sendFile(__dirname + "/build/index.html");
});

app.use("/api", router)

app.listen(port, () => {
   console.log(`Server is up on port ${port}!`);
});
