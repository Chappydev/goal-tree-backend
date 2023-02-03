const express = require("express");
const app = express();
const cors = require("cors");
const goalsRouter = require("./controllers/goals");
const nodesRouter = require("./controllers/nodes");
const overviewRouter = require("./controllers/overview");

app.use(cors());
app.use(express.json());

app.use("/api/goals", goalsRouter);
app.use("/api/nodes", nodesRouter);
app.use("/api/goalsoverview", overviewRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
