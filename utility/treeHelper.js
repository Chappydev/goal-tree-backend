const replaceChildIdWithNode = (node, nodeList) => {
  if (node.children.length < 1) {
    return node;
  }

  const newChildren = node.children.map((id) => {
    return nodeList.find((node) => node.id === id);
  });

  const newChildrenTree = newChildren.map((child) => {
    return replaceChildIdWithNode(child, nodeList);
  });

  const newNode = { ...node, children: newChildrenTree };

  return newNode;
};

const buildTree = (insertionNodeId, nodes) => {
  const initNode = nodes.find((node) => node.id === insertionNodeId);

  const tree = replaceChildIdWithNode(initNode, nodes);

  return tree;
};

const buildOverview = (goal, nodes) => {
  const initNode = nodes.find((node) => node.id === goal.insertionNodeId);
  const incompleteNodes = nodes.reduce(
    (arr, curr) => {
      return !curr.isComplete &&
        arr.some((node) => node.children.some((childId) => childId === curr.id))
        ? [...arr, curr]
        : arr;
    },
    [initNode]
  );

  return { goalId: goal.id, goalNode: initNode, incompleteNodes };
};

module.exports = {
  buildTree,
  buildOverview,
};
