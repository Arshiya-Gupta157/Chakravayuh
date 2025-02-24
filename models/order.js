const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  restaurantId: mongoose.Schema.Types.ObjectId,
  items: [{ item: String, quantity: Number, price: Number }],
  totalAmount: Number,
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("Order", orderSchema);
