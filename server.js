require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const PORT = 5000;

//Routes
const userRouter = require("./routes/userRouter");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cookieParser());

//Routes
app.use("", userRouter);

app.all("*", (req, res) => {
  res.status(404).send("Sorry, the requested route was not found");
});

//CONNECTIONS
mongoose.set("strictQuery", true);
const url = "mongodb://127.0.0.1:27017/authDb";
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  autoIndex: false,
});
connect
  .then(() => {
    console.log("connected to db succesfully");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
