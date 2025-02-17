require("dotenv").config(); // Laad de .env-variabelen

const express = require("express");
const cors = require("cors"); // Importeer CORS
const { connectToDatabase } = require("./database"); // Correcte import van connectToDatabase
const authRoutes = require("./routes/authRoutes"); // Auth-routes importeren
const userRoutes = require("./routes/userRoutes"); // User-routes importeren
const fetch = require("node-fetch"); // Zorg dat je node-fetch hebt geïnstalleerd

const app = express();
const PORT = process.env.PORT || 5001; // Gebruik Render's PORT variabele

// CORS configuratie
const corsOptions = {
  origin: "https://orbital-atlas.vercel.app", // Toestaan voor je frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions)); // Gebruik de CORS middleware
app.use(express.json()); // Middleware om JSON-requests te verwerken

// Basisroute voor de root ("/")
app.get("/", (req, res) => {
  res.send("Welcome to the Orbital Atlas API!");
});

// API-routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);



// ✅ **Belangrijk: Start de server PAS NA ALLE ROUTES!**
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
