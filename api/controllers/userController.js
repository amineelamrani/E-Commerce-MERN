const Order = require("../models/orderModel");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const stripe = require("stripe")(process.env.STRIPE_TEST);
const express = require("express");
const app = express();
app.use(express.static("public"));

const YOUR_DOMAIN = "http://localhost:5173/orders";

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(202).json({
    status: "success",
    result: users,
  });
});

exports.orderProduct = catchAsync(async (req, res, next) => {
  //// /!\ Update this orderProduct endPoint
  // 1. get deliveryInformation + products to buy + payment method
  // 2. check deliveryinformation robustness (skip now)
  ////// IF STRIPE
  // 3. take each product from productsToBuy => Create a checkout session (first step work with only the prices sent via frontend)
  // 4. Once success => create an order (orderModel) with the productsToBuy + deliveryInformation + payment status + statusDelivery 'order Placed'
  // 4.1 and update the userModel (ordersID add it) + update productModel (ordersNumber to add 1 or more for each product)
  // 4.2. In success => redirect to /orders?success=true

  ////// IF COD
  // 2. get delivery information and add order and update userModel (ordersID add it) + update productModel (ordersNumber to add 1 or more for each product)

  const { deliveryInformation, productsToBuy, paymentMethod } = req.body;
  // deliveryInformation to check its robustness
  // productsToBuy => Check if it follows the format
  if (paymentMethod === "stripe") {
    const paymentItems = productsToBuy.map((item, index) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    });

    paymentItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Shipping Fee",
        },
        unit_amount: 10 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: paymentItems,
      mode: "payment",
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });
    return res.status(303).json({ url: session.url });

    // return res.json(303, session.url);
  } else {
    console.log("COD");
    res.status(202).json({
      status: "success",
      result: { deliveryInformation, productsToBuy, paymentMethod },
    });
  }

  /*const { productID } = req.params;
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
  });*/
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
