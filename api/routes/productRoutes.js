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
router.get("/:productID/isreviewed", productController.isProductReviewed);

// Admin restricted routes
router.use(authController.adminRestricted);
// we can view products (already done /products) - now need to add products and delete some and update the price of some

router.post("/", productController.addProduct);
router.delete("/:productID", productController.deleteProduct);
router.patch("/:productID", productController.updateProduct);

module.exports = router;
