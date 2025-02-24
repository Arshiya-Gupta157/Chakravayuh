const Order = require("../models/order");

exports.createOrder = async (req, res) => {
  try {
    const { userId, restaurantId, items, totalAmount } = req.body;
    const order = new Order({ userId, restaurantId, items, totalAmount });
    await order.save();
    res.send("Order placed successfully");
  } catch (err) {
    res.status(500).send("Error placing order");
  }
};
