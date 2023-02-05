const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  insertionNode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Node",
  },
});

goalSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Goal", goalSchema);
