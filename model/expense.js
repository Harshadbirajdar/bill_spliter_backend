const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const expenseSchmea = new mongoose.Schema({
  desc: {
    type: String,
    required: [true, "Please enter a description"],
  },
  amount: {
    type: Number,
    required: [true, "Please enter a amount"],
  },
  members: [
    {
      owne: {
        type: ObjectId,
        ref: "user",
      },
      lent: {
        type: ObjectId,
        ref: "user",
      },
      amount: {
        type: Number,
      },
    },
  ],
  paidBy: {
    type: ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: ObjectId,
    ref: "User",
  },
});

expenseSchmea.pre("find", function (next) {
  this.populate({
    path: "members",
    populate: {
      path: "owne lent",
      model: "User",
      select: "name",
    },
  });

  next();
});
module.exports = mongoose.model("Expense", expenseSchmea);
