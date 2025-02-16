const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://rob:7GDSQzyr4V2LXL96@cluster0.j9o9s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let client;

// Connect to the database
async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri, {});
    try {
      await client.connect();
      console.log("Successfully connected to MongoDB!");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1); // Stop de server als de verbinding niet lukt
    }
  }
  return client;
}

module.exports = { connectToDatabase };
