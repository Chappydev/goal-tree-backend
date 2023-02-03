const { goals, nodes } = require("../utility/predbLeftovers");
const { buildOverview } = require("../utility/treeHelper");

const overviewRouter = require("express").Router();

overviewRouter.get("/", (request, response) => {
  if (!goals || goals.length === 0) {
    response.status(404).json({ error: "There are no goals" });
  }

  const overview = goals.map((goal) => buildOverview(goal, nodes));
  response.json(overview);
});

module.exports = overviewRouter;
