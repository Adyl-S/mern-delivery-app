// Menu.jsx (updated with navigation to Order Summary)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";

function Menu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [newFood, setNewFood] = useState({ name: "", price: "" });

  const userLocation = { lat: 21.1458, lng: 79.0882 };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/restaurants/${id}/foods`)
      .then((res) => setFoodItems(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const addToCart = (item) => {
    if (!item.name || !item.price) return;
    const exists = cart.find((f) => f.foodItemId === item._id);
    if (exists) {
      setCart(
        cart.map((f) =>
          f.foodItemId === item._id ? { ...f, qty: f.qty + 1 } : f
        )
      );
    } else {
      setCart([
        ...cart,
        {
          foodItemId: item._id,
          name: item.name,
          price: item.price,
          qty: 1,
        },
      ]);
    }
  };

  const placeOrder = () => {
    axios
      .post("http://localhost:5000/order", {
        restaurantId: id,
        items: cart.map((item) => ({
          foodItemId: item.foodItemId,
          qty: item.qty,
        })),
        userLocation,
      })
      .then((res) => {
        navigate("/order-summary", {
          state: {
            summary: res.data,
            items: cart,
          },
        });
        setCart([]);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>🍽️ Menu</h2>
        <div>
          <h3>🛒 Cart</h3>
          {cart.length === 0 ? (
            <p>No items yet</p>
          ) : (
            cart.map((item) => (
              <div key={item.foodItemId}>
                {item.name} × {item.qty} = ₹{item.qty * item.price}
              </div>
            ))
          )}
          {cart.length > 0 && (
            <button style={{ marginTop: "10px" }} onClick={placeOrder}>
              🧾 Place Order
            </button>
          )}
        </div>
      </div>

      {foodItems.map((item) =>
        item.name && item.price ? (
          <div className="card" key={item._id}>
            <p>
              <strong>{item.name}</strong> - ₹{item.price}
            </p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        ) : null
      )}

      <h3>🍴 Add Food Item</h3>
      <input
        placeholder="Food Name"
        value={newFood.name}
        onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
      />
      <input
        placeholder="Price"
        value={newFood.price}
        onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
      />
      <button
        onClick={() => {
          axios
            .post("http://localhost:5000/foods", {
              name: newFood.name,
              price: parseFloat(newFood.price),
              restaurantId: id,
            })
            .then(() => {
              setNewFood({ name: "", price: "" });
              return axios.get(`http://localhost:5000/restaurants/${id}/foods`);
            })
            .then((res) => setFoodItems(res.data))
            .catch((err) => console.log(err));
        }}
      >
        Add Food
      </button>
    </div>
  );
}

export default Menu;
