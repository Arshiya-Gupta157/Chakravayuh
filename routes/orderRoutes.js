const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/place-order", orderController.createOrder);

module.exports = router;
