import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const PORT = 5050;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const MONGO_URL = "mongodb://admin:qwerty@localhost:27017";

const client = new MongoClient(MONGO_URL);

// Database Connection
const connectDB = async () => {
  try {
    await client.connect();
    console.log("MongoDB Connected");
    return client.db("test-db");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

// GET all users
app.get("/getUsers", async (req, res) => {
  try {
    const db = await connectDB();

    const users = await db
      .collection("users")
      .find({})
      .toArray();

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});

// POST new user
app.post("/addUser", async (req, res) => {
  try {
    const db = await connectDB();

    const result = await db
      .collection("users")
      .insertOne(req.body);

    res.status(201).json({
      message: "User Added Successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});