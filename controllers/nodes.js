const { nodes, generateId } = require("../utility/predbLeftovers");

const nodesRouter = require("express").Router();

nodesRouter.get("/", (request, response) => {
  response.json(nodes);
});

nodesRouter.get("/:id", (request, response) => {
  const id = Number(request.params.id);
  const requestedNode = nodes.find((node) => node.id === id);
  if (requestedNode) {
    response.json(requestedNode);
  } else {
    return response.status(404).end();
  }
});

nodesRouter.put("/:id", (request, response) => {
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

nodesRouter.post("/:id", (request, response) => {
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

nodesRouter.delete("/:id", (request, response) => {
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

module.exports = nodesRouter;
