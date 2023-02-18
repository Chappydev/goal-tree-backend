const config = require("./utility/config");
const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");

const goalsRouter = require("./controllers/goals");
const nodesRouter = require("./controllers/nodes");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const overviewRouter = require("./controllers/overview");

const middleware = require("./utility/middleware");
const logger = require("./utility/logger");
const mongoose = require("mongoose");
const staticRouter = require("./controllers/static");

mongoose.set("strictQuery", false);

logger.info("connecting to MongoDB");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

// When adding in frontend, must take express.static('build')
// into use!
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use(middleware.requestLogger);
app.use(middleware.tokenDecoder);

app.use("/api/goals", goalsRouter);
app.use("/api/nodes", nodesRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/goalsoverview", overviewRouter);
app.use("/", staticRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
