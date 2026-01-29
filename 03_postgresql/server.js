import express from "express";

import { db } from "./db.js";
import { cars } from "./schema.js";

const app = express();

const port = 3000;

const router = express.Router();

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();

  console.log(`[$${timestamp}] ${req.method} ${req.originalUrl}`);

  next();
});

router.get("/", (req, res) => {
  res.send("Hello from the Cars API");
});

router.get("/cars/:id", (req, res) => {
  const id = Number(req.params.id);
  const car = cars.find((car) => car.id === id);

  if (!car) return res.status(404).send("Car not found");

  res.json(car);
});

router.get("/cars", async (req, res) => {
  const allCars = await db.select().from(cars);

  res.json(allCars);
});

router.post("/cars", async (req, res) => {
  const { make, model, year, price } = req.body;

  if (!make || !model || !year || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const [newCar] = await db
    .insert(cars)
    .values({
      make,
      model,
      year,
      price,
    })
    .returning();

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
