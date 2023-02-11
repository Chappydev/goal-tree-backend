const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("goals", {
  ref: "Goal",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("nodes", {
  ref: "Node",
  localField: "_id",
  foreignField: "user",
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
  virtuals: true,
});

module.exports = mongoose.model("User", userSchema);
