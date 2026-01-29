import express from "express";

const app = express();

const port = 3000;

const router = express.Router();

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();

  console.log(`[$${timestamp}] ${req.method} ${req.originalUrl}`);

  next();
});

let cars = [
  { id: 1, make: "Toyota", model: "Corolla", year: 2020, price: 28000 },
  { id: 2, make: "Tesla", model: "Model S", year: 2023, price: 25000 },
  { id: 3, make: "Ford", model: "F-150", year: 2021, price: 35000 },
];

router.get("/", (req, res) => {
  res.send("Hello from the Cars API");
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const car = cars.find((car) => car.id === id);

  if (!car) return res.status(404).send("Car not found");

  res.json(car);
});

router.get("/cars", (req, res) => {
  res.json(cars);
});

router.post("/cars", (req, res) => {
  const { make, model, year, price } = req.body;

  if (!make || !model || !year || !price) {
    return res.status(400).send("All fields are required");
  }

  const newCar = {
    id: cars.length + 1,
    make,
    model,
    year: Number(year),
    price: Number(year),
  };

  cars.push(newCar);
  res.status(201).json(newCar);
});

router.put("/cars/:id", (req, res) => {
  const id = Number(req.params.id);

  const carIndex = cars.findIndex((car) => car.id === Number(id));

  if (carIndex === -1) return res.status(404).send("Car not found");

  const { make, model, year, price } = req.body;

  if (!make || !model || !year || !price) {
    return res.status(400).send("All fields are required");
  }

  if (make) cars[carIndex].make = make;
  if (model) cars[carIndex].model = model;
  if (year) cars[carIndex].year = Number(year);
  if (price) cars[carIndex].price = Number(price);

  res.json(cars[carIndex]);
});

router.delete("/cars/:id", (req, res) => {
  const id = Number(req.params.id);

  const carIndex = cars.findIndex((car) => car.id === Number(id));

  if (carIndex === -1) return res.status(400).send("Car not found");

  const deleted = cars.splice(carIndex, 1);

  res.send({ message: "Car deleted", car: deleted[0] });
});

router.get("/cars/:id", (req, res) => {
  res.send("Get car by ID");
});

app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
