const bcrypt = require("bcrypt");
const User = require("../models/user");

const userRouter = require("express").Router();

userRouter.get("/exists", async (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: "username missing" });
  }

  const user = await User.exists({ username });

  res.json({ username, exists: !!user });
});

userRouter.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).populate({
    path: "goals",
    populate: {
      path: "insertionNode",
      options: {
        disableMiddlewares: true,
      },
    },
  });
  if (user) {
    res.json({ id: user._id, username: user.username, goals: user.goals });
  } else {
    res.status(404).end();
  }
});

userRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json({
    id: savedUser._id,
    username: savedUser.username,
    goals: savedUser.goals,
  });
});

module.exports = userRouter;
