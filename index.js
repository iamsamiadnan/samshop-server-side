const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nkjseli.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const database = client.db("shop");
    const brandsCollection = database.collection("brands");
  
    app.get('/brands', async (req, res) => {

        const cursor = brandsCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    // app.get('/users/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const query = {_id: new ObjectId(id)}
    //     const user = await collection.findOne(query)
    //     res.send(user)

    // })

    // app.put('/users/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const user = req.body;

    //   const filter = { _id: new ObjectId(id)}
    //   const options = { upsert: true}
    //   const updatedUser = {
    //     $set: {
    //       name: user.name,
    //       email: user.email
    //     }
    //   }

    //   const result = await collection.updateOne(filter, updatedUser, options)
    //   res.send(result)
    // })

    // app.post('/users', async (req, res) => {
    //     const user = req.body;
    //    const result = await collection.insertOne(user);

    //     res.send(result)
    // })

    // app.delete('/users/:uid', async (req, res) => {
    //     const uid = req.params.uid;
    //     const query = {_id: new ObjectId(uid)}
    //     const result = await collection.deleteOne(query)
    //     res.send(result)
    // })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

















app.get('/', (req, res) => {
    res.send("Hello!")
})

app.listen(port, () => {
    console.log(`... ${port}`)
})