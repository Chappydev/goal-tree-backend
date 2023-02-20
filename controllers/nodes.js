const { default: mongoose } = require("mongoose");
const Node = require("../models/node");
const { userFinder } = require("../utility/middleware");

const nodesRouter = require("express").Router();

nodesRouter.get("/", userFinder, async (req, res) => {
  const nodes = await Node.find({ user: req.user._id }, null, {
    disableMiddlewares: true,
  });
  if (nodes) {
    res.json(nodes);
  } else {
    res.status(404).end();
  }
});

nodesRouter.get("/:id", userFinder, async (req, res) => {
  const node = await Node.findById(req.params.id, null, {
    disableMiddlewares: true,
  });
  if (node) {
    if (node.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "users may only access their own goals" });
    }
    res.json(node);
  } else {
    res.status(404).end();
  }
});

nodesRouter.put("/:id", userFinder, async (req, res) => {
  const body = req.body;
  console.log(body);
  const updatedNode = await Node.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    body,
    {
      new: true,
      disableMiddlewares: true,
    }
  );
  if (!updatedNode) {
    return res.status(404).end();
  }

  res.json(updatedNode);
});

nodesRouter.post("/:id", userFinder, async (req, res) => {
  const parentId = req.params.id;

  if (!req.user) {
    return res.status(401).json({ error: "must be logged in to create nodes" });
  }

  const parentNode = await Node.findById(parentId, null, {
    disableMiddlewares: true,
  });
  if (!parentNode) {
    return res.status(404).json({ error: "invalid parent id" });
  } else if (parentNode.user.toString() !== req.user._id.toString()) {
    return res
      .status(401)
      .json({ error: "users may only make changes to their own nodes" });
  }

  const body = req.body;

  if (body.name === undefined || body.insertInd === undefined) {
    return res
      .status(400)
      .json({ error: "must include node name and insertion index" });
  }

  const { name, insertInd } = body;

  const newNode = new Node({
    name,
    user: req.user._id,
  });

  const savedNode = await newNode.save();

  const newChildren = [...parentNode.children];
  newChildren.splice(insertInd, 0, savedNode._id);
  parentNode.children = newChildren;
  await parentNode.save();

  res.status(201).json(savedNode);
});

nodesRouter.delete("/:id", userFinder, async (req, res) => {
  const parentNode = await Node.findOne(
    {
      children: { $elemMatch: { $eq: req.params.id } },
    },
    null,
    { disableMiddlewares: true }
  );
  if (parentNode.user.toString() !== req.user._id.toString()) {
    return res
      .status(401)
      .json({ error: "users may only delete their own nodes" });
  }

  console.log(parentNode);
  if (parentNode) {
    const newChildren = [...parentNode.children];
    const indexToRemove = newChildren.findIndex(
      (child) => child.toString() === req.params.id
    );
    const deleted = newChildren.splice(indexToRemove, 1);
    parentNode.children = newChildren;
    await parentNode.save();
  }

  const castedId = new mongoose.Types.ObjectId(req.params.id);
  const idAggregate = await Node.aggregate([
    {
      $match: {
        _id: castedId,
      },
    },
    {
      $graphLookup: {
        from: "nodes",
        startWith: "$children",
        connectFromField: "children",
        connectToField: "_id",
        as: "ids",
      },
    },
    {
      $project: {
        ids: {
          $map: {
            input: "$ids",
            as: "id",
            in: "$$id._id",
          },
        },
        _id: 0,
      },
    },
  ]);

  const { ids } = idAggregate[0];
  ids.push(castedId);

  await Node.deleteMany({ _id: { $in: ids } });

  res.status(204).end();
});

module.exports = nodesRouter;
