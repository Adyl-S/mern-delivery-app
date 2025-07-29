const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Restaurant = require("./models/Restaurant");
const FoodItem = require("./models/FoodItem");
const Order = require("./models/Order");



const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// ADD RESTAURANT
app.post("/restaurants", async (req, res) => {
  try {
    const { name, address, location } = req.body;
    const newRestaurant = new Restaurant({ name, address, location });
    const saved = await newRestaurant.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD FOOD ITEM
app.post("/foods", async (req, res) => {
  try {
    const { name, price, restaurantId } = req.body;
    const newFood = new FoodItem({ name, price, restaurant: restaurantId });
    const saved = await newFood.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL RESTAURANTS
app.get("/restaurants", async (req, res) => {
  const data = await Restaurant.find();
  res.json(data);
});

// GET FOOD FOR A RESTAURANT
app.get("/restaurants/:id/foods", async (req, res) => {
  const data = await FoodItem.find({ restaurant: req.params.id });
  res.json(data);
});


app.post("/order", async (req, res) => {
  const { restaurantId, items, userLocation } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);

  // Distance calculation (Haversine formula)
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(userLocation.lat - restaurant.location.lat);
  const dLon = toRad(userLocation.lng - restaurant.location.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(restaurant.location.lat)) *
      Math.cos(toRad(userLocation.lat)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  const deliveryCharge = Math.round(distance * 5); // ₹5/km

  // Get food details
  const foodDetails = await Promise.all(
    items.map(async (i) => {
      const food = await FoodItem.findById(i.foodItemId);
      return { ...food._doc, qty: i.qty };
    })
  );

  const subtotal = foodDetails.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + deliveryCharge;

  const order = new Order({
    restaurantId,
    items,
    userLocation,
    subtotal,
    deliveryCharge,
    total,
  });

  await order.save();
  res.json({ message: "Order placed successfully", subtotal, deliveryCharge, total });
});



app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
