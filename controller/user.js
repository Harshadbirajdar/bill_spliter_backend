const User = require("../model/user");
const BigPromise = require("../middleware/BigPromise");
const cookieToken = require("../util/cookieToken");
const emailHelper = require("../util/emailHelper");
const crypto = require("crypto");
const logger = require("../logger");

exports.signup = BigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email) {
    return next(new Error("Please enter email"));
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  user.password = undefined;
  cookieToken(user, res);
});

exports.signin = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Error("please provide email and password"));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new Error("Email or password does not match or exist"));
  }

  const isPasswordCorrect = await user.isValidatedPassword(password);

  if (!isPasswordCorrect) {
    return next(new Error("Email or password does not match or exist", 400));
  }
  cookieToken(user, res);
  logger.info(`Signin IP ${req.ip} of ${user.email}`);
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new Error("Email not found as registered"));
  }

  const forgotToken = user.getForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;

  const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`;

  try {
    await emailHelper({
      email: user.email,
      subject: "Password reset email",
      message,
    });

    res.status(200).json({
      succes: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new Error(error.message));
  }
});

exports.passwordReset = BigPromise(async (req, res, next) => {
  const token = req.params.token;
  const { password, confirmPassword } = req.body;

  const encryToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: encryToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new Error("Token is invalid or expired"));
  }

  if (password !== confirmPassword) {
    return next(new Error("password and confirm password do not match"));
  }
  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  cookieToken(user, res);
});

exports.changePassword = BigPromise(async (req, res, next) => {
  const { oldPassword, password } = req.body;
  if (!oldPassword || !password) {
    return next(new Error("Please enter a password"));
  }

  let userId = req.user.id;
  let user = await User.findById(userId).select("+password");

  let isCorrectPassword = await user.isValidatedPassword(oldPassword);

  if (!isCorrectPassword) {
    return next(new Error("Password dosen't match"));
  }
  user.password = password;
  await user.save();
  cookieToken(user, res);
});

exports.home = BigPromise((req, res) => {
  res.json({ message: "Hello From Harshad..." });
});

exports.findUser = BigPromise(async (req, res, next) => {
  const { email } = req.query;

  if (!email) {
    return next(new Error("Please enter a email"));
  }
  let user = await User.findOne({ email }).select("name email");
  if (!user) {
    return next(new Error("User not found"));
  }
  return res.json({
    user,
  });
});
