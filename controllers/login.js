const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const passwordIsCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!user || !passwordIsCorrect) {
    return res.status(401).json({
      error: "incorrect username or password",
    });
  }

  const userDataForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userDataForToken, process.env.SECRET);

  res.status(200).send({ token, username: user.username, id: user._id });
});

module.exports = loginRouter;
