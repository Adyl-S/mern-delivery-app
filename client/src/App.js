import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import OrderSummary from "./pages/OrderSummary";

function App() {
  return (
    <BrowserRouter>
      <h1 style={{ textAlign: "center" }}>🍔 Food Delivery App</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu/:id" element={<Menu />} />
        <Route path="/order-summary" element={<OrderSummary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
