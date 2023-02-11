const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("./logger");

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  logger.info("Body:  ", req.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: "unknown endpoint" });
  next();
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(400).json({ error: "token missing or invalid" });
  } else if (error.name === "MongoServerError" && error.code === 11000) {
    return res.status(400).json({ error: "that username is already taken" });
  }

  next(error);
};

const tokenDecoder = (req, res, next) => {
  const auth = req.get("authorization");
  if (!auth || !auth.toLowerCase().startsWith("bearer ")) {
    req.decodedToken = null;
    return next();
  }
  const token = auth.substring(7);

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "invalid token" });
  }
  req.decodedToken = decodedToken;
  next();
};

const userFinder = async (req, res, next) => {
  // if (!req.decodedToken?.id) {
  //   req.user = null;
  //   return next();
  // }
  if (!req.decodedToken) {
    return res.status(401).json({ error: "invalid token" });
  }

  const user = await User.findById(req.decodedToken.id);
  if (!user) {
    return res.status(404).json({ error: "no such user" });
  }

  req.user = user;
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenDecoder,
  userFinder,
};
