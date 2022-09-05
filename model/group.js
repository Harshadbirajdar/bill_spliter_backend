const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a group name"],
      maxlength: [80, "Group name should be under 40 characters"],
    },
    desc: {
      type: String,
      required: [true, "Please enter a Description"],
    },
    budget: {
      type: Number,
      default: -1,
    },
    expense: [
      {
        type: ObjectId,
        ref: "Expense",
      },
    ],
    member: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Group", groupSchema);
