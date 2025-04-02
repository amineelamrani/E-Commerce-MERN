const express = require("express");
const productController = require("./../controllers/productController");
const authController = require("./../controllers/authController");

const router = express.Router();

// Open routes
router.get("/", productController.viewProducts);
router.get("/:productID", productController.getProduct);

// Protected routes
router.use(authController.protect);

router.post("/:productID/reviews", productController.addReview);

// Admin restricted routes
router.use(authController.adminRestricted);

router.post("/", productController.addProduct);

module.exports = router;
