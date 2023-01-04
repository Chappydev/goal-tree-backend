const express = require("express");
const app = express();
const cors = require("cors");
const { buildTree } = require("./utility/treeHelper");

app.use(cors());
app.use(express.json());

let goals = [
  {
    id: 0,
    insertionNodeId: 1,
  },
];

let nodes = [
  {
    id: 1,
    name: "Eat more",
    isComplete: false,
    children: [2, 3],
  },
  {
    id: 2,
    name: "Eat Chicken",
    isComplete: false,
    children: [10],
  },
  {
    id: 3,
    name: "Eat While Doing other things",
    isComplete: false,
    children: [4, 8, 9],
  },
  {
    id: 4,
    name: "Eat while doing chores",
    isComplete: true,
    children: [5, 7],
  },
  {
    id: 5,
    name: "Eat while walking the dog",
    isComplete: true,
    children: [6],
  },
  {
    id: 6,
    name: "test",
    isComplete: true,
    children: [],
  },
  {
    id: 7,
    name: "Eat while making dinner",
    isComplete: true,
    children: [],
  },
  {
    id: 8,
    name: "Eat while doing backflips",
    isComplete: true,
    children: [11],
  },
  {
    id: 9,
    name: "Eat while singing",
    isComplete: true,
    children: [],
  },
  {
    id: 10,
    name: "Buy chicken",
    isComplete: false,
    children: [],
  },
  {
    id: 11,
    name: "Don't choke",
    isComplete: false,
    children: [],
  },
];

app.get("/api/goals/:id", (request, response) => {
  const id = Number(request.params.id);
  const goalData = goals.find((goal) => goal.id === id);
  if (goalData) {
    const treeData = buildTree(goalData.insertionNodeId, nodes);
    response.json(treeData);
  } else {
    response.status(404).end();
  }
});

app.get("/api/nodes", (request, response) => {
  response.json(nodes);
});

app.get("/api/nodes/:id", (request, response) => {
  const id = Number(request.params.id);
  const requestedNode = nodes.find((node) => node.id === id);
  if (requestedNode) {
    response.json(requestedNode);
  } else {
    return response.status(404).end();
  }
});

app.put("/api/nodes/:id", (request, response) => {
  const id = Number(request.params.id);
  const body = request.body;
  // replace node with updated node from request body
  nodes = nodes.map((node) =>
    node.id === id
      ? {
          id: node.id,
          name: body.name,
          isComplete: body.isComplete,
          children: body.children,
        }
      : node
  );
  // find updated node and send that as response
  const updatedNode = nodes.find((node) => node.id === id);
  response.json(updatedNode);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
