const staticRouter = require("express").Router();
const path = require("path");

staticRouter.get(["/", "/*"], (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

module.exports = staticRouter;
