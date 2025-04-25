const express = require("express");
const productController = require("./../controllers/productController");
const authController = require("./../controllers/authController");

const router = express.Router();

// Open routes
router.get("/", productController.viewProducts);
router.get("/latest", productController.getLatest10Products);
router.get("/bestseller", productController.getBest5SellersProducts);
router.get("/:productID", productController.getProduct);
router.get("/:productID/reviews", productController.getReviews);

// Protected routes
router.use(authController.protect);
router.get("/purchased/products", productController.getPurchasedProducts);
router.post("/:productID/reviews", productController.addReview);

// Admin restricted routes
router.use(authController.adminRestricted);

router.post("/", productController.addProduct);

module.exports = router;
