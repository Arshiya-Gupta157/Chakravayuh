const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: String,
  location: String,
  cuisine: String,
  rating: Number,
  menu: [{ item: String, price: Number }],
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
