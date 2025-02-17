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

// Testdata voor events
app.get("/api/events", (req, res) => {
  res.json([
    { id: 1, name: "Lunar Eclipse", date: "2025-03-14" },
    { id: 2, name: "Mars Opposition", date: "2025-06-22" }
  ]);
});

// Proxy route voor AstronomyAPI
app.get("/api/astronomy-events", async (req, res) => {
    try {
        const API_ID = process.env.ASTRONOMY_API_ID;
        const SECRET_KEY = process.env.ASTRONOMY_API_SECRET;

        if (!API_ID || !SECRET_KEY) {
            return res.status(500).json({ error: "Missing API credentials" });
        }

        const response = await fetch("https://api.astronomyapi.com/api/v2/studio/events", {
            method: "GET",
            headers: {
                "Authorization": `Basic ${Buffer.from(`${API_ID}:${SECRET_KEY}`).toString("base64")}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Failed to fetch Astronomy API events");

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ **Belangrijk: Start de server PAS NA ALLE ROUTES!**
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
