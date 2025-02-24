const Restaurant = require("../models/restaurant");

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.render("restaurant", { restaurants });
  } catch (err) {
    res.status(500).send("Error fetching restaurants");
  }
};
