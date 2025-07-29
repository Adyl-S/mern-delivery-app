const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  restaurantId: String,
  items: Array, // { foodItemId, qty }
  userLocation: Object,
  subtotal: Number,
  deliveryCharge: Number,
  total: Number,
});

module.exports = mongoose.model("Order", OrderSchema);
