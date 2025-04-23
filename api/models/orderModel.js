const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        productID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        size: {
          type: String,
        },
        quantity: {
          type: Number,
          min: 0,
        },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deliverInformation: {
      firstName: String,
      lastName: String,
      email: String,
      adress: String,
      phone: String,
    },
    payment: {
      method: String,
      status: String,
      infos: String,
    },
    statusDelivery: {
      type: String,
      default: "Order Placed",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
