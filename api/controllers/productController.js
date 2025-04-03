const Review = require("../models/reviewModel");
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

  const { content, rating, productSize } = req.body;

  const newReview = await Review.create({
    owner: req.userId,
    content,
    rating,
    productSize,
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
