exports.response = (res, message, data) => {
  const statusCode = res.statusCode ? res.statusCode : 200;
  res.status(statusCode);
  res.json({
    success: true,
    message: message,
    data,
  });
};
