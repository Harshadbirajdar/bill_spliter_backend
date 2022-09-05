const BigPromise = require("../middleware/BigPromise");
const Group = require("../model/group");
const User = require("../model/user");
const { response } = require("../middleware/response");
exports.addGroup = BigPromise(async (req, res, next) => {
  const group = await Group.create({ ...req.body, createdBy: req.user });

  let user = await User.findById(req.user._id);
  user.groups.push(group);
  await user.save();
  return response(res, "Group added successfully", group);
});

// get all groups that you are in
exports.getAllGroup = BigPromise(async (req, res, next) => {
  let user = await User.findById(req.user._id)
    .populate("groups")
    .select("groups name");

  return response(res, "Group fetch successfully", user);
});

// get groups in details
exports.getGroupDetails = BigPromise(async (req, res, next) => {
  let groupId = req.query.id;

  const group = await Group.findById(groupId)
    .populate({
      path: "expense",
      populate: {
        path: "paidBy createdBy",
        model: "User",
        select: "name",
      },
    })
    .populate("member", {
      name: 1,
      email: 1,
    });

  let settle = [];
  group.expense?.forEach((data) => {
    data.members.forEach((member) => {
      settle.push(member);
    });
  });

  return res.status(200).json({
    success: true,
    message: "Group deatils fetch successfully",
    group: { ...group._doc, settle },
  });
});
