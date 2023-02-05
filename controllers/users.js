const bcrypt = require("bcrypt");
const User = require("../models/user");

const userRouter = require("express").Router();

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
    res.json(user);
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

  res.status(201).json(savedUser);
});

module.exports = userRouter;
