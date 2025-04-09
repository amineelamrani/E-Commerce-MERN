const Order = require("../models/orderModel");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(202).json({
    status: "success",
    result: users,
  });
});

exports.orderProduct = catchAsync(async (req, res, next) => {
  const { productID } = req.params;
  const owner = req.userId;
  const { productSize, quantity, deliverInformation, payment } = req.body;
  const newOrder = await Order.create({
    product: productID,
    productSize,
    quantity,
    owner,
    deliverInformation,
    payment,
  });
  // + update the orders array of the user
  const user = await User.findById(owner);
  user.orders.push(newOrder._id);
  user.confirmPassword = user.password;
  await user.save();
  res.status(202).json({
    status: "success",
    result: { order: newOrder, user },
  });
});

exports.viewOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId).populate("owner", "name");
  res.status(202).json({
    status: "success",
    result: order,
  });
});

exports.getAuthenticatedUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId).select(
    "-password -uniqueString -confirmPassword"
  );
  if (user && user.length === 0) {
    return res.status(400).json({
      status: "fail",
      result: user,
    });
  }
  res.status(202).json({
    status: "success",
    result: user,
  });
});
