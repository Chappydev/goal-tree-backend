const express = require("express");
const app = express();
const cors = require("cors");
const { buildTree, buildOverview } = require("./utility/treeHelper");

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

const generateId = () => {
  return Math.floor(Math.random() * 10000000);
};

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

app.post("/api/goals", (request, response) => {
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

app.get("/api/goals-overview", (request, response) => {
  if (!goals || goals.length === 0) {
    response.status(404).json({ error: "There are no goals" });
  }

  const overview = goals.map((goal) => buildOverview(goal, nodes));
  response.json(overview);
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

app.post("/api/nodes/:id", (request, response) => {
  const parentId = Number(request.params.id);
  const body = request.body;
  console.log(body);

  if (body.name === undefined || body.insertInd === undefined) {
    return response
      .status(400)
      .json({ error: "must include node name and insertion index" });
  }

  const { name, insertInd } = body;

  const nodeToInsert = {
    id: generateId(),
    name,
    isComplete: false,
    children: [],
  };

  // insert new node's id into parent's children array
  // then push the new node onto the nodes array
  const newNodes = nodes.map((node) => {
    return node.id === parentId
      ? {
          id: node.id,
          name: node.name,
          isComplete: node.isComplete,
          children: node.children
            .slice(0, insertInd)
            .concat([
              nodeToInsert.id,
              ...node.children.slice(insertInd, node.children.length),
            ]),
        }
      : node;
  });
  newNodes.push(nodeToInsert);
  nodes = newNodes;

  response.json({ parentId, node: nodeToInsert });
});

app.delete("/api/nodes/:id", (request, response) => {
  const id = Number(request.params.id);
  // TODO: remove children nodes of the specified node

  console.log(nodes);
  nodes = nodes
    .filter((node) => node.id !== id)
    .map((node) => {
      if (node.children.some((childId) => childId === id)) {
        const indToDelete = node.children.findIndex(
          (childId) => childId === id
        );
        const childrenCopy = [...node.children];
        childrenCopy.splice(indToDelete, 1);
        return { ...node, children: childrenCopy };
      } else {
        return node;
      }
    });
  console.log(nodes);

  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
