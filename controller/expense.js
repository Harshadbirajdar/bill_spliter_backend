const BigPromise = require("../middleware/BigPromise");
const Expense = require("../model/expense");
const Group = require("../model/group");

exports.addExpense = BigPromise(async (req, res, next) => {
  const { amount, member, desc, paidBy, groupId } = req.body;

  let splitAmount = amount / member.length;
  let members = [];

  member.forEach((user) => {
    let object = {
      owne: paidBy,
      lent: user,
      amount: splitAmount,
    };
    members.push(object);
  });

  const expense = await Expense.create({
    desc,
    amount,
    members,
    paidBy,
    createdBy: req.user,
  });

  const group = await Group.findByIdAndUpdate(groupId, {
    $push: { expense: expense },
  });
  return res.json({
    success: true,
    message: "Expense added successfully",
    expense,
  });
});
