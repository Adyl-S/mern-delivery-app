import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OrderSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { summary, items } = state || { summary: {}, items: [] };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧾 Order Summary</h2>
      {items.map((item, index) => (
        <div key={index}>
          {item.name} × {item.qty} = ₹{item.qty * item.price}
        </div>
      ))}
      <hr />
      <p>Subtotal: ₹{summary?.subtotal}</p>
      <p>Delivery: ₹{summary?.deliveryCharge}</p>
      <h3>Total: ₹{summary?.total}</h3>
      <button style={{ marginTop: "20px" }} onClick={() => navigate("/")}>
        🏠 Go Home
      </button>
    </div>
  );
}

export default OrderSummary;
