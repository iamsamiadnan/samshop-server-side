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
    const productsCollection = database.collection("products");
    const cartsCollection = database.collection("carts");
  
    app.get('/brands', async (req, res) => {

        const cursor = brandsCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/products', async (req, res) => {

      const cursor = productsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/products/flashsales', async (req, res) => {

      const query = { flash_sale: true }
      const cursor = productsCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })


    app.get('/products/single/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const result = await productsCollection.findOne(query)
   
      res.send(result)
    })



  app.get('/products/:brand', async (req, res) => {
    const param = req.params.brand.toLowerCase();
    
    const query = { brand: param }
    const cursor = productsCollection.find(query)
    const result = await cursor.toArray()
    res.send(result)
})


  app.get('/products/cart/:id', async (req, res) => {
    const param = req.params.id;
    
    const query = { _uid: param }
    const cursor = cartsCollection.find(query)
    const result = await cursor.toArray()
    res.send(result)
  })


    app.post('/addProducts', async (req, res) => {
      const product = req.body;

      const result = await productsCollection.insertOne(product);

      res.send(result)
    })

    app.post('/addToCart', async (req, res) => {
      const product = req.body;
      product._pid = new ObjectId(product._pid)

      const result = await cartsCollection.insertOne(product);

      res.send(result)
    })

  

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const product = req.body;

      const filter = { _id: new ObjectId(id)}
      const options = { upsert: false}
      const updatedProduct = {
        $set: {
          image_url: product.image_url,
          name: product.name,
          brand: product.brand,
          category:product.category ,
          price:product.price,
          desc:product.desc,
          ratings:product.ratings,
          flash_sale: false
        }
      }

   
      const result = await productsCollection.updateOne(filter, updatedProduct, options)
      res.send(result)
    })

    

    app.delete('/products/:id/:uid', async (req, res) => {
        const id = req.params.id;
        const uid = req.params.uid;

        const query = {_pid: new ObjectId(id), _uid: uid}

      
        const result = await cartsCollection.deleteOne(query)
        res.send(result)
    })


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