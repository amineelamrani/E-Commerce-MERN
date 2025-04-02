const express = require("express");
const authController = require("./../controllers/authController");

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

// Admin restricted routes
router.use(authController.adminRestricted);

module.exports = router;
