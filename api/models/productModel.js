const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please give the product a title!"],
    },
    description: {
      type: String,
      required: [true, "Please give the product a description!"],
    },
    price: {
      type: Number,
      required: [true, "Please give the product a description!"],
    },
    sizes: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    category: [
      {
        type: String,
      },
    ],
    subCategory: [
      {
        type: String,
      },
    ],
    reviewsNumber: {
      type: Number,
      default: 0,
    },
    reviewsMedian: {
      // To update each time we have a new create or save here or in the reviews model
      type: Number,
      default: 0,
    },
    ordersNumber: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
