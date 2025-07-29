const mongoose = require("mongoose");

const FoodItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
});

module.exports = mongoose.model("FoodItem", FoodItemSchema);
