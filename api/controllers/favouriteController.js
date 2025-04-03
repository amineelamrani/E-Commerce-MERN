const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.addFavourite = catchAsync(async (req, res, next) => {
  const { productID } = req.params;
  const { size } = req.body;
  const user = await User.findById(req.userId);
  user.confirmPassword = user.password;
  user.favourites.push({
    product: productID,
    size,
  });
  await user.save();
  res.status(202).json({
    status: "success",
    result: user,
  });
});

exports.getFavs = catchAsync(async (req, res, next) => {
  const owner = req.userId;
  const user = await User.findById(owner);
  res.status(202).json({
    status: "success",
    result: {
      user: user.name,
      favourites: user.favourites,
    },
  });
});

exports.deleteFav = catchAsync(async (req, res, next) => {
  const { favouriteID } = req.params;
  const user = await User.findById(req.userId);

  const newFavourites = user.favourites.filter(
    (fav) => fav._id.toString() !== favouriteID
  );
  user.favourites = [...newFavourites];
  user.confirmPassword = user.password;
  await user.save();
  res.status(202).json({
    status: "success",
    result: user,
  });
});
