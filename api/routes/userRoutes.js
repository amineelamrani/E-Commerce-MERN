const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const favouriteController = require("./../controllers/favouriteController");

const router = express.Router();

// Auth routes
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/oauth", authController.oAuth);
router.get("/signout", authController.signOut);
router.get("/verify", authController.verifyAccount);
router.post("/forgetPassword", authController.forgetPassword);
router.post("/resetPassword/:email/:token", authController.resetPassword);

// To protect routes
router.use(authController.protect);
router.get("/order/:orderId", userController.viewOrder);
router.post("/buy/:productID", userController.orderProduct);
router.post("/favourites/add/:productID", favouriteController.addFavourite);
router.get("/favourites", favouriteController.getFavs);
router.delete("/favourites/:favouriteID", favouriteController.deleteFav);

// Admin restricted routes
router.use(authController.adminRestricted);
router.get("/", userController.getUsers);

module.exports = router;
