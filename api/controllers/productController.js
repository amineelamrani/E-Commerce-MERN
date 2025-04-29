const Order = require("../models/orderModel");
const Review = require("../models/reviewModel");
const User = require("../models/userModel");
const Product = require("./../models/productModel");
const catchAsync = require("./../utils/catchAsync");

exports.viewProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  if (!products) {
    return res.status(400).json({
      status: "fail",
      message: "No products is found",
    });
  }

  res.status(202).json({
    status: "success",
    result: products,
  });
});

exports.addProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, sizes, images, category, subCategory } =
    req.body;
  if (
    !title ||
    !description ||
    !price ||
    !sizes ||
    !images ||
    !category ||
    !subCategory
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all the necessary information of the product",
    });
  }

  const newProduct = await Product.create({
    title,
    description,
    price,
    sizes,
    images,
    category,
    subCategory,
  });
  if (!newProduct) {
    return res.status(400).json({
      status: "fail",
      message: "Cannot create the product given!",
    });
  }

  res.status(202).json({
    status: "success",
    result: newProduct,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const { productID } = req.params;
  const product = await Product.findById(productID);

  if (!product) {
    return res.status(400).json({
      status: "fail",
      message: "Cannot find the product given!",
    });
  }

  res.status(202).json({
    status: "success",
    result: product,
  });
});

exports.addReview = catchAsync(async (req, res, next) => {
  const { productID } = req.params;

  const { content, rating } = req.body;

  const newReview = await Review.create({
    owner: req.userId,
    content,
    rating,
    product: productID,
  });
  if (!newReview) {
    return res.status(400).json({
      status: "fail",
      message: "Cannot create the review given!",
    });
  }
  const product = await Product.findById(productID);
  product.reviewsNumber++;
  if (product.reviewsNumber === 1) {
    product.reviewsMedian = rating;
  } else {
    product.reviewsMedian = (product.reviewsMedian + rating) / 2;
  }

  await product.save();

  res.status(202).json({
    status: "success",
    result: {
      product: product,
      review: newReview,
    },
  });
});

exports.getReviews = catchAsync(async (req, res, next) => {
  const { productID } = req.params;
  const reviews = await Review.find({ product: productID }).populate(
    "owner",
    "name"
  );
  if (!reviews) {
    return res.status(400).json({
      status: "fail",
      message: "Cannot see the reviews of the product!",
    });
  }

  res.status(202).json({
    status: "success",
    result: reviews,
  });
});

exports.getLatest10Products = catchAsync(async (req, res, next) => {
  // get 10 latest added products
  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .exec();
  res.status(202).json({
    status: "success",
    result: products,
  });
});

exports.getBest5SellersProducts = catchAsync(async (req, res, next) => {
  // get 5 Best sellers product
  const products = await Product.find({})
    .sort({ ordersNumber: -1 })
    .limit(5)
    .exec();

  res.status(202).json({
    status: "success",
    result: products,
  });
});

exports.getPurchasedProducts = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId)
    .select("orders")
    .populate("orders", "products statusDelivery");

  const userOrdersDelivered = user.orders.filter(
    (order) => order.statusDelivery === "Delivered"
  );

  // Now userOrdersDelivered => take the userOrdersDelivered.products (all of them and delete the redundance)
  const arrayOfProducts = userOrdersDelivered.flatMap((entry) =>
    entry.products.map((product) => product.productID.toString())
  );

  const uniqueProductIDs = [...new Set(arrayOfProducts)];

  res.status(202).json({
    status: "success",
    result: uniqueProductIDs,
  });
});

exports.isProductReviewed = catchAsync(async (req, res, next) => {
  const { productID } = req.params;
  const userReviews = await Review.find({
    product: productID,
    owner: req.userId,
  });
  res.status(202).json({
    status: "success",
    result: userReviews,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { productID } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(productID);
  if (!deletedProduct) {
    return res
      .status(404)
      .json({ status: "fail", message: "Product not found." });
  }
  res
    .status(200)
    .json({ status: "success", message: "Product deleted successfully." });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { productID } = req.params;
  const { title, price } = req.body;

  const updates = {};
  if (title !== undefined) updates.title = title;
  if (price !== undefined) updates.price = price;

  const updatedProduct = await Product.findByIdAndUpdate(
    productID,
    { $set: updates },
    { new: true }
  );
  if (!updatedProduct) {
    return res
      .status(404)
      .json({ status: "fail", message: "Product not found." });
  }

  res.status(200).json({ status: "success", result: updatedProduct });
});
