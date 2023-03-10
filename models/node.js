const mongoose = require("mongoose");

// can't use arrow syntax because of the this keyword
const populateChildren = function (next) {
  let match = null;
  if (this._conditions.hasOwnProperty("isComplete")) {
    match = {
      isComplete: this._conditions.isComplete,
    };
  }
  if (!this.options.disableMiddlewares) {
    this.populate({
      path: "children",
      match,
    });
  }
  next();
};

const nodeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
  },
  isComplete: {
    type: Boolean,
    required: true,
    default: false,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node",
    },
  ],
});

nodeSchema.pre("findOne", populateChildren);
nodeSchema.pre("find", populateChildren);

nodeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.user;
  },
});

module.exports = mongoose.model("Node", nodeSchema);
