const Goal = require("../models/goal");
const User = require("../models/user");
const { userFinder } = require("../utility/middleware");

const overviewRouter = require("express").Router();

overviewRouter.get("/", userFinder, async (req, res) => {
  const goalsOverview = await Goal.find({
    _id: { $in: req.user.goals },
  }).populate({
    path: "insertionNode",
    options: { disableMiddlewares: true },
    populate: {
      path: "children",
      match: {
        isComplete: false,
      },
    },
  });

  res.json(goalsOverview);
});

module.exports = overviewRouter;
