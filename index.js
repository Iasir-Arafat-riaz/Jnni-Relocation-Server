const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const res = require("express/lib/response");

const app = express();
const port = process.env.PORT || 2021;

app.use(cors());
app.use(express.json());

// Jinni-Relocation
// e55d7lsv0emlFoXc

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gukqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//client connect
async function run() {
  try {
    await client.connect();
    const database = client.db("JinniRelocation");
    const services = database.collection("services");
    const booking = database.collection("booking");


    //start from this
    app.post("/services",async(req,res)=>{
      console.log(req.body)
      const query = req.body
      const result = await services.insertOne(query);
      res.json(result)
})

//find all services
app.get("/services", async(req,res)=>{
  const findservice = services.find({})
  const result = await findservice.toArray()
  res.json(result)

})
//find single services
 app.get("/services/:id", async(req,res)=>{
  //  console.log(req.params.id);
   const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await services.findOne(query);
      res.json(result);
 })

 //post/insert operation for service booking
app.post("/booking", async(req,res)=>{
  const query =req.body
  const result = await booking.insertOne(query);
  res.json(result)
})

app.get("/booking",async(req,res)=>{
  const findMyBooking= booking.find({})
  const result = await findMyBooking.toArray()
  res.json(result)
})

//Delete my Booking
app.delete("/booking/:id", async (req, res) => {
  const id = req.params.id;
  const remove = { _id: ObjectId(id) };
  const restOrder = await booking.deleteOne(remove);
  res.json(restOrder);
});
    
  } 
  
  finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("jinni relocation is rolling");
});

app.listen(port, () => {
  console.log("running server on port", port);
});
