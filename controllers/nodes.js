const { nodes, generateId } = require("../utility/predbLeftovers");
const Node = require("../models/node");

const nodesRouter = require("express").Router();

nodesRouter.get("/", async (req, res) => {
  const nodes = await Node.find({}, null, { disableMiddlewares: true });
  if (nodes) {
    res.json(nodes);
  } else {
    res.status(404).end();
  }
});

nodesRouter.get("/:id", async (req, res) => {
  const node = await Node.findById(req.params.id, null, {
    disableMiddlewares: true,
  });
  if (node) {
    res.json(node);
  } else {
    res.status(404).end();
  }
});

nodesRouter.put("/:id", async (req, res) => {
  const body = req.body;
  console.log(body);
  const updatedNode = await Node.findByIdAndUpdate(req.params.id, body, {
    new: true,
  });
  res.json(updatedNode);
});

nodesRouter.post("/:id", async (req, res) => {
  const parentId = req.params.id;

  const parentNode = await Node.findById(parentId);
  if (!parentNode) {
    return res.status(404).json({ error: "invalid parent id" });
  }

  const body = req.body;
  console.log(body);

  if (body.name === undefined || body.insertInd === undefined) {
    return res
      .status(400)
      .json({ error: "must include node name and insertion index" });
  }

  const { name, insertInd } = body;

  const newNode = new Node({
    name,
  });

  const savedNode = await newNode.save();

  const newChildren = [...parentNode.children];
  newChildren.splice(insertInd, 0, savedNode._id);
  parentNode.children = newChildren;
  await parentNode.save();

  res.status(201).json(savedNode);
});

nodesRouter.delete("/:id", async (req, res) => {
  // TODO: remove children nodes of the specified node

  const parentNode = await Node.findOne({
    children: { $elemMatch: { $eq: req.params.id } },
  });
  if (parentNode) {
    const newChildren = [...parentNode.children];
    newChildren.splice(
      newChildren.findIndex((child) => child === req.params.id),
      1
    );
    parentNode.children = newChildren;
    await parentNode.save();
  }

  await Node.findByIdAndDelete(req.params.id);

  res.status(204).end();
});

module.exports = nodesRouter;
