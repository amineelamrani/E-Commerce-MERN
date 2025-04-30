const Order = require("../models/orderModel");
const Product = require("../models/productModel");
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
  const { deliveryInformation, productsToBuy, paymentMethod, money } = req.body;
  // deliveryInformation to check its robustness
  if (
    deliveryInformation.firstName !== "" &&
    deliveryInformation.lastName !== "" &&
    deliveryInformation.email !== "" &&
    deliveryInformation.street !== "" &&
    deliveryInformation.city !== "" &&
    deliveryInformation.state !== "" &&
    deliveryInformation.country !== "" &&
    deliveryInformation.zipCode * 1 > 0 &&
    deliveryInformation.phone * 1 > 10
  ) {
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
      // if COD => Directly update the schemas and for the payment say that payment is pending
      const products = productsToBuy.map((item, index) => {
        return {
          productID: item.id,
          size: item.size,
          quantity: item.quantity,
          title: item.title,
        };
      });

      const newOrder = await Order.create({
        products,
        owner: req.userId,
        deliveryInformation,
        payment: {
          method: "cod",
          status: "pending",
          money,
        },
        statusDelivery: "Order Placed",
      });

      const actualUser = await User.findById(req.userId);
      actualUser.orders.push(newOrder._id);
      actualUser.confirmPassword = actualUser.password;
      await actualUser.save();

      const arrayProducts = productsToBuy.map(async (item, index) => {
        const productImpacted = await Product.findById(item.id);
        productImpacted.ordersNumber++;
        await productImpacted.save();
        return productImpacted;
      });

      res.status(200).json({
        status: "success",
        result: {
          order: newOrder,
          user: actualUser,
          products: arrayProducts,
        },
      });
    }
  } else {
    return res.status(400).json({
      status: "fail",
      message: "Not robust delivery information",
    });
  }
});

exports.orderProductStripeSuccess = catchAsync(async (req, res, next) => {
  // when payment is successeded : we need to update schemas
  // add OrderModel
  // update userModel => add order in orders
  // update productModel => add +1 in ordersNumber for each product of orders
  const { deliveryInformation, productsToBuy, paymentMethod, money } = req.body;
  const products = productsToBuy.map((item, index) => {
    return {
      productID: item.id,
      size: item.size,
      quantity: item.quantity,
      title: item.title,
    };
  });

  const newOrder = await Order.create({
    products,
    owner: req.userId,
    deliveryInformation,
    payment: {
      method: "stripe",
      status: "payed",
      money,
    },
    statusDelivery: "Order Placed",
  });

  const actualUser = await User.findById(req.userId);
  actualUser.orders.push(newOrder._id);
  actualUser.confirmPassword = actualUser.password;
  await actualUser.save();

  const arrayProducts = productsToBuy.map(async (item, index) => {
    const productImpacted = await Product.findById(item.id);
    productImpacted.ordersNumber++;
    await productImpacted.save();
    return productImpacted;
  });

  res.status(200).json({
    status: "success",
    result: {
      order: newOrder,
      user: actualUser,
      products: arrayProducts,
    },
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

exports.getAllOrders = catchAsync(async (req, res, next) => {
  // get all orders 10 orders per fetching (and do a paging in the front end)
  const page = parseInt(req.query.page) || 1; // default to page 1
  const limit = 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalOrders = await Order.countDocuments();

  res.status(200).json({
    page,
    totalPages: Math.ceil(totalOrders / limit),
    totalOrders,
    orders,
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  // Update delivery status + update payment in case of COD
  // /!\ Add the possibility to send an email informing him that his order is delivered and purchased and he can put a review
  // DeliveryStatus => Order Placed,Packing, Shipping, Deliverd
  // payment => pending + payed
  const { orderID } = req.params;
  const { statusDelivery } = req.body;

  const updatedOrder = await Order.findById(orderID);

  if (!updatedOrder) {
    return res
      .status(404)
      .json({ status: "fail", message: "Order not found." });
  }

  if (
    updatedOrder.payment.method === "cod" &&
    updatedOrder.payment.status === "pending" &&
    updatedOrder.statusDelivery === "Delivered"
  ) {
    updatedOrder.payment = { ...updatedOrder.payment, ["status"]: "payed" };
  }
  if (statusDelivery !== undefined) {
    updatedOrder.statusDelivery = statusDelivery;
  }

  await updatedOrder.save();

  res.status(202).json({
    status: "success",
    result: updatedOrder,
  });
});
