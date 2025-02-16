const express = require("express");
const router = express.Router();

router.post("/add-user", async (req, res) => {
  try {
    const result = await req.app.locals.db.collection("users").insertOne(req.body);
    res.status(201).json({ message: "User added", userId: result.insertedId });
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).send("An error occurred");
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await req.app.locals.db.collection("users").find().toArray();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;
