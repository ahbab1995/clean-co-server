const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jf83z4j.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

async function run() {
  try {
    await client.connect();
    const servicesCollection = client
      .db("cleanCo")
      .collection("service");

      app.get("/get-service", async (req, res) => {
        const query = {};
        const cursor = servicesCollection.find(query);
        const services = await cursor.toArray();
        console.log(services)
        res.send(services);
      });

      app.post('/add-service',async(req,res)=>{
        const data = req.body;
        const result = await servicesCollection.insertOne(data);
        res.send(result) 
      })

      app.put('/update-service/:id',async(req,res)=>{
        const { id } = req.params;
        const data = req.body;
        const filter = { _id:ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = { $set: data,};
        const result = await servicesCollection.updateOne(
          filter,
          updateDoc,
          options
        );
  
        res.send(result);
      })
      

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("clean co");
  });
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });



