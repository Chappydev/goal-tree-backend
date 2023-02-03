const generateId = () => {
  return Math.floor(Math.random() * 10000000);
};

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

module.exports = {
  generateId,
  goals,
  nodes,
};
