import React, { useEffect, useState } from "react";
import Car from "./components/Car";

const App = () => {
  const [cars, setCars] = useState([]);

  const carItem = {
    make: "Ferrari",
    model: "T Series",
    year: 2025,
    price: "36000.00",
  };

  useEffect(() => {
    fetch("api/v1/cars")
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch((error) => console.error(error));
  }, []);

  const handlePostCarData = () => {
    fetch("api/v1/cars", {
      method: "POST",
      body: JSON.stringify(carItem),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => console.log(res.json()))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Welcome to the Car</h1>

      <ul>
        {cars.map((car) => (
          <Car key={car.id} {...car} />
        ))}
      </ul>

      <button onClick={handlePostCarData}>POST API Request</button>
    </div>
  );
};

export default App;
