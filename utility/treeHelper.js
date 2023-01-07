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

module.exports = {
  buildTree,
};
