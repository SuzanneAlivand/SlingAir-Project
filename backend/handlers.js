"use strict";

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");
const path = require("path");
require("dotenv").config({ path: "../.env" });
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// use this data. Changes will persist until the server (backend) restarts.
// const { flights, reservations } = require("./data");

const getFlights = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Slingair");
    const result = await db.collection("flights").find().toArray();
    res.status(200).json({
      status: 200,
      data: result,
    });
    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getFlight = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Slingair");
    const result = await db.collection("flights").find().toArray();
    res.status(200).json({ status: 200, data: result });
    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};
// add a new reservation to db
const addReservation = async (req, res) => {
  const { flight, seat, givenName, surname, email } = req.body;
  console.log(seat);
  if (!seat) {
    return res.status(400).json({
      status: 400,
      message: "Please choose a seat!",
    });
  } else if (!givenName || !surname || !email) {
    return res.status(400).json({
      status: 400,
      message: "Please provide your information!",
    });
  } else {
    const newReservation = await Object.assign({ _id: uuidv4() }, req.body);
    try {
      const client = new MongoClient(MONGO_URI, options);
      await client.connect();
      const db = client.db("Slingair");
      await db.collection("reservations").insertOne(newReservation);

      const result = await db
        .collection("flights")
        .findOneAndUpdate(
          { flight: `${flight}` },
          { $set: { "seats.$[elem].isAvailable": false } },
          { arrayFilters: [{ "elem.id": `${seat}` }] }
        );

      return res.status(201).json({
        status: 201,
        message: "The ticket successfully reserved!",
        data: newReservation,
      });
      client.close();
    } catch (err) {
      console.log(err.stack);
      res
        .status(500)
        .json({ status: 500, data: req.body, message: err.message });
    }
  }
};
// getting all the reservation of the specifuc user
const getReservations = async (req, res) => {
  const _id = req.params._id;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Slingair");
    const theClient = await db.collection("reservations").findOne({ _id });
    const clientEmail = theClient.email;
    var query = { email: clientEmail };
    const result = await db.collection("reservations").find(query).toArray();

    res.status(200).json({
      status: 200,
      data: result,
    });
    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getSingleReservation = async (req, res) => {
  try {
    const _id = req.params._id;
    console.log(_id);
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Slingair");
    const result = await db.collection("reservations").findOne({ _id });
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, message: "Not Found" });
    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deleteReservation = async (req, res) => {
  const _id = req.params._id;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Slingair");
    //finding the seat of the resrvation which is going to be deleted:
    const { seat, flight } = await db
      .collection("reservations")
      .findOne({ _id });

    const result = await db.collection("reservations").deleteOne({ _id });
    if (result.deletedCount === 0) {
      res.status(404).json({ status: 404, _id, message: "Not Found" });
    } else {
      // and I'll make this seat available in flight list:
      await db
        .collection("flights")
        .findOneAndUpdate(
          { flight: `${flight}` },
          { $set: { "seats.$[elem].isAvailable": true } },
          { arrayFilters: [{ "elem.id": `${seat}` }] }
        );
      return res.status(204).json({ status: 204, _id, message: "deleted" });
    }
    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

// update
const updateReservation = async (req, res) => {
  const _id = req.params._id;
  const { seat } = req.body;
  if (!seat) {
    return res
      .status(400)
      .json({ status: 400, data: req.body, message: "no value for seat" });
  }
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Slingair");
    const result = await db
      .collection("reservations")
      .updateOne({ _id }, { $set: { seat } });
    res.status(200).json({ status: 200, _id, seat });
    console.log(result);
    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  getFlights,
  getFlight,
  getReservations,
  addReservation,
  getSingleReservation,
  deleteReservation,
  updateReservation,
};
