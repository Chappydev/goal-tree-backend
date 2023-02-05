const Goal = require("../models/goal");
const Node = require("../models/node");

const goalsRouter = require("express").Router();

goalsRouter.get("/:id", async (req, res) => {
  const goalData = await Goal.findById(req.params.id).populate("insertionNode");
  if (goalData) {
    res.json(goalData);
  } else {
    res.status(404).end();
  }
});

goalsRouter.post("/", async (req, res) => {
  if (!req?.body?.name) {
    res.status(400).json({ error: "Must include a name for the goal node" });
  }
  const { name } = req.body;
  const goalNode = new Node({
    name,
  });
  const savedGoalNode = await goalNode.save();

  const goal = new Goal({
    insertionNode: savedGoalNode.id,
  });
  const savedGoal = await goal.save();

  res.json({ goalId: savedGoal.id, goalNode: savedGoalNode });
});

module.exports = goalsRouter;
