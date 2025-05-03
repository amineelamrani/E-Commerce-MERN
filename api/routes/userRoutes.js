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
router.get("/current", userController.getAuthenticatedUser);
router.get("/order/:orderId", userController.viewOrder);
router.get("/current/order/:orderId", userController.viewCurrentUserOrder);
router.post("/buy", userController.orderProduct);
router.post("/buy/stripe/success", userController.orderProductStripeSuccess);
router.post("/favourites/add/:productID", favouriteController.addFavourite);
router.get("/favourites", favouriteController.getFavs);
router.delete("/favourites/:favouriteID", favouriteController.deleteFav);

// Admin restricted routes
router.use(authController.adminRestricted);
router.get("/", userController.getUsers);
router.get("/admin/orders", userController.getAllOrders);
router.patch("/admin/orders/:orderID/update", userController.updateOrderStatus);

module.exports = router;
