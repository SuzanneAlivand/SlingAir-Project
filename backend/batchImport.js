const { flights, reservations } = require("./data");
const { MongoClient } = require("mongodb");
const path = require("path");
require("dotenv").config({ path: "../.env" });
const { MONGO_URI } = process.env;
const { v4: uuidv4 } = require("uuid");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async () => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Slingair");
    const flight = [{ _id: uuidv4(), flight: "SA231", seats: flights.SA231 }];
    db.collection("flights").insertMany(flight);
    await db.collection("reservations").insertMany(reservations);
    client.close();
  } catch (err) {
    console.log(err.message);
  }
};
batchImport();
