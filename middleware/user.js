const BigPromise = require("./BigPromise");
const User = require("../model/user");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return next(new Error("Login First to access the page"));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
});

exports.isInTheGroup = BigPromise(async (req, res, next) => {
  let user = req.user;
  let groupId = req.query.id;
  if (!user.groups.includes(groupId)) {
    return next(new Error("Your are not of this group participant"));
  }

  next();
});
