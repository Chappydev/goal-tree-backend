const { goals, nodes, generateId } = require("../utility/predbLeftovers");
const { buildTree } = require("../utility/treeHelper");

const goalsRouter = require("express").Router();

goalsRouter.get("/:id", (request, response) => {
  const id = Number(request.params.id);
  const goalData = goals.find((goal) => goal.id === id);
  if (goalData) {
    const treeData = buildTree(goalData.insertionNodeId, nodes);
    response.json(treeData);
  } else {
    response.status(404).end();
  }
});

goalsRouter.post("/", (request, response) => {
  if (!request?.body?.name) {
    response
      .status(400)
      .json({ error: "Must include a name for the goal node" });
  }
  const { name } = request.body;
  const goalNode = {
    id: generateId(),
    name,
    isComplete: false,
    children: [],
  };

  nodes.push(goalNode);

  const goalData = {
    id: generateId(),
    insertionNodeId: goalNode.id,
  };

  goals.push(goalData);

  response.json({ goalId: goalData.id, goalNode });
});

module.exports = goalsRouter;
