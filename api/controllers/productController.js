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
