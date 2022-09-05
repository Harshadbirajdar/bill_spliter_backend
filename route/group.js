const express = require("express");
const {
  addGroup,
  getAllGroup,
  getGroupDetails,
} = require("../controller/group");
const { isLoggedIn, isInTheGroup } = require("../middleware/user");
const router = express.Router();

router.route("/group").post(isLoggedIn, addGroup).get(isLoggedIn, getAllGroup);

router.route("/group/details").get(isLoggedIn, isInTheGroup, getGroupDetails);

module.exports = router;
