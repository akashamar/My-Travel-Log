const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

const middlewares = require("./middlewares");
const logs = require("./api/logs");

//Convers the body req from post to JSON
app.use(express.json());

app.enable("trust proxy"); // needed for rate limiting by client ip

require("dotenv").config();

app.use(morgan("common")); // gets the status date HTTP ext.. in the console
app.use(helmet()); //to hide the headers in network
app.use(
  cors({
    origin: process.env.CORES_ORIGIN,
  })
);

//Connecting to dataBase
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//instead of get route error in the browser we created a message with jason
app.get("/", (req, res) => {
  res.json({
    message: "Hellow world!",
  });
});

app.use("/api/logs", logs);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Listening at https://${port}`);
});
