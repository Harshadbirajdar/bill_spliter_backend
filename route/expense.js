const express = require("express");
const { addExpense } = require("../controller/expense");
const { isLoggedIn } = require("../middleware/user");
const router = express.Router();

router.route("/expense").post(isLoggedIn, addExpense);

module.exports = router;
