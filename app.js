const express = require("express");
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("tiny"));

// import all routes here
const user = require("./route/user");
const group = require("./route/group");
const expense = require("./route/expense");

// router middleware
app.use("/api/v1", user);
app.use("/api/v1", group);
app.use("/api/v1", expense);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
