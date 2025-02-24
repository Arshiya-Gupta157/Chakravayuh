const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Routes
router.get("/", userController.landingPage);
router.get("/signup", userController.getSignup);
router.post("/signup", userController.postSignup);
router.get("/login", userController.getLogin);
router.post("/login", userController.postLogin);
router.get("/profile", userController.getProfile);
router.post("/profile", userController.updateProfile);

module.exports = router;
