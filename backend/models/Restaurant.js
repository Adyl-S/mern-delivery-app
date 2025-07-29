const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  location: {
    lat: Number,
    lng: Number,
  },
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
