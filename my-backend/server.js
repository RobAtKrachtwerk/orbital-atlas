require("dotenv").config(); // Laad de .env-variabelen

const express = require("express");
const cors = require("cors"); // Importeer CORS
const { connectToDatabase } = require("./database"); // Correcte import van connectToDatabase
const authRoutes = require("./routes/authRoutes"); // Auth-routes importeren
const userRoutes = require("./routes/userRoutes"); // User-routes importeren
const killPort = require("kill-port"); // Importeer kill-port


const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuratie
const corsOptions = {
  origin: "*", // Tijdelijk alle origins toestaan voor debuggen
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions)); // Gebruik de CORS middleware

// Middleware om JSON-requests te verwerken
app.use(express.json());

// Basisroute voor de root ("/")
app.get("/", (req, res) => {
  res.send("Welcome to the Orbital Atlas API!");
});

// API-routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
