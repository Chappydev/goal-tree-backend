const mongoose = require("mongoose");

const nodeSchema = new mongoose.Schema({
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
      ref: "node",
    },
  ],
});

nodeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Node", nodeSchema);
