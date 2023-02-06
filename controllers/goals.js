const Goal = require("../models/goal");
const Node = require("../models/node");
const { userFinder } = require("../utility/middleware");

const goalsRouter = require("express").Router();

goalsRouter.get("/:id", userFinder, async (req, res) => {
  const goalData = await Goal.findById(req.params.id).populate("insertionNode");
  if (goalData) {
    if (goalData.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "users may only access their own goals" });
    }
    res.json(goalData);
  } else {
    res.status(404).end();
  }
});

goalsRouter.post("/", userFinder, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "must be logged in to create goals" });
  }
  if (!req?.body?.name) {
    res.status(400).json({ error: "Must include a name for the goal node" });
  }
  const { name } = req.body;
  const goalNode = new Node({
    name,
    user: req.user._id,
  });
  const savedGoalNode = await goalNode.save();

  const goal = new Goal({
    insertionNode: savedGoalNode.id,
    user: req.user._id,
  });
  const savedGoal = await goal.save();

  res.json({ goalId: savedGoal.id, goalNode: savedGoalNode });
});

module.exports = goalsRouter;
