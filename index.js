const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@jubair2.qej77gj.mongodb.net/?retryWrites=true&w=majority&appName=Jubair2`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const flashSaleCollections = client.db("babycare").collection("flashSales");
    const productCollections = client.db("babycare").collection("products");

    // flash sales api======

    app.get("/flash-sale", async (req, res) => {
      try {
        const result = await productCollections
          .find({ flashSale: true })
          .sort({ date: -1 })
          .toArray();
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    // post flash sell

    app.post("/flash-sale", async (req, res) => {
      try {
        const newData = req.body;
        const result = await flashSaleCollections.insertOne(newData);
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    // products

    // get

    app.get("/products", async (req, res) => {
      try {
        const result = await productCollections.find().toArray();
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    // get single

    app.get("/products/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const query = { _id: new ObjectId(id) };
        const result = await productCollections.findOne(query);
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    // get products by category

    app.get("/category-product", async (req, res) => {
      try {
        const { category } = req.query;
        const result = await productCollections
          .find({ category: category })
          .toArray();
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    // get most

    app.get("/popular-products", async (req, res) => {
      try {
        const result = await productCollections
          .find()
          .sort({ rating: -1 })
          .toArray();
        res.send(result);
      } catch (error) {
        res.send("Internal Server Error");
      }
    });

    // post

    app.post("/create-products", async (req, res) => {
      try {
        const newProducts = req.body;
        const result = await productCollections.insertOne(newProducts);
        res.send(result);
      } catch (error) {
        console.log(error);
        res.send("Internal Server Error");
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
