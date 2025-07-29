import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/restaurants")
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.log(err));
  }, []);

  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    address: "",
    lat: "",
    lng: "",
  });

  return (
    <div className="container">
      <h2>🏪 Add Restaurant</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Name"
          value={newRestaurant.name}
          onChange={(e) =>
            setNewRestaurant({ ...newRestaurant, name: e.target.value })
          }
        />
        <input
          placeholder="Address"
          value={newRestaurant.address}
          onChange={(e) =>
            setNewRestaurant({ ...newRestaurant, address: e.target.value })
          }
        />
        <input
          placeholder="Latitude"
          value={newRestaurant.lat}
          onChange={(e) =>
            setNewRestaurant({ ...newRestaurant, lat: e.target.value })
          }
        />
        <input
          placeholder="Longitude"
          value={newRestaurant.lng}
          onChange={(e) =>
            setNewRestaurant({ ...newRestaurant, lng: e.target.value })
          }
        />
        <button
          onClick={() => {
            axios
              .post("http://localhost:5000/restaurants", {
                name: newRestaurant.name,
                address: newRestaurant.address,
                location: {
                  lat: parseFloat(newRestaurant.lat),
                  lng: parseFloat(newRestaurant.lng),
                },
              })
              .then(() => {
                setNewRestaurant({ name: "", address: "", lat: "", lng: "" });
                return axios.get("http://localhost:5000/restaurants");
              })
              .then((res) => setRestaurants(res.data))
              .catch((err) => console.log(err));
          }}
        >
          Add Restaurant
        </button>
      </div>

      <h2>🍽️ Available Restaurants</h2>
      {restaurants.length === 0 ? (
        <p>Loading restaurants...</p>
      ) : (
        restaurants.map((r) => (
          <div className="card" key={r._id}>
            <h3>{r.name}</h3>
            <p>{r.address}</p>
            <button onClick={() => navigate(`/menu/${r._id}`)}>View Menu</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
