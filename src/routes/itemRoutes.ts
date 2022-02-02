import { getClient } from "../db";
import express from "express";
import Item from "../models/Item";
import { ObjectId } from "mongodb";

const itemRoutes = express.Router();

// GET
itemRoutes.get("/cart-items", async (req, res) => {
  try {
    let prefix: string = req.query.prefix as string;
    let maxPrice: number = Number(req.query.maxPrice as string);
    let pageSize: number = Number(req.query.pageSize as string) || 0;
    let product: string = req.query.product as string;
    let query: object = {};
    if (prefix) query = { product: { $regex: "^" + prefix, $options: "i" } };
    if (maxPrice) query = { price: { $lte: maxPrice } };
    if (product) query = { product: product };
    if (prefix && maxPrice)
      query = {
        product: { $regex: "^" + prefix, $options: "i" },
        price: { $lte: maxPrice },
      };
    const client = await getClient();
    const results = await client
      .db()
      .collection<Item>("cartItems")
      .find(query, { limit: pageSize })
      .toArray();
    res.json(results);
  } catch (err) {
    console.error("ERROR", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET BY ID
itemRoutes.get("/cart-items/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const client = await getClient();
    const item = await client
      .db()
      .collection<Item>("cartItems")
      .findOne({ _id: new ObjectId(id) });
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: "ID Not Found" });
    }
  } catch (err) {
    console.error("ERROR", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST
itemRoutes.post("/cart-items", async (req, res) => {
  const item = req.body as Item;
  try {
    const client = await getClient();
    await client.db().collection<Item>("cartItems").insertOne(item);
    res.status(201).json(item);
  } catch (err) {
    console.error("ERROR", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT
itemRoutes.put("/cart-items/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body as Item;
  delete data._id;
  try {
    const client = await getClient();
    const result = await client
      .db()
      .collection<Item>("cartItems")
      .replaceOne({ _id: new ObjectId(id) }, data);
    if (result.modifiedCount === 0) {
      res.status(404).json({ message: "ID Not Found" });
    } else {
      data._id = new ObjectId(id);
      res.json(data);
    }
  } catch (err) {
    console.error("ERROR", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE
itemRoutes.delete("/cart-items/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const client = await getClient();
    const result = await client
      .db()
      .collection<Item>("cartItems")
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "ID Not Found" });
    } else {
      res.status(204).end();
    }
  } catch (err) {
    console.error("ERROR", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default itemRoutes;
