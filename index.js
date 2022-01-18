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
    const users = database.collection("users")
    const reviews = database.collection("reviews");


    //start from this
    app.post("/services",async(req,res)=>{
      console.log(req.body)
      const query = req.body
      const result = await services.insertOne(query);
      res.json(result)
})

//find all services
app.get("/allServices", async(req,res)=>{
  const findservice = services.find({})
  const result = await findservice.toArray()
  res.json(result)

})

app.get("/services", async(req,res)=>{
  // const findservice = services.find({})
  //Get Services Dynamically ------Randomly
  const cursor = services.aggregate([{ $sample: { size: 4 } }])
  const result = await cursor.toArray()
 
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

//Review functionalities

app.post("/reviews", async (req, res) => {
  const review = req.body;
  const result = await reviews.insertOne(review);
  res.json(result);
});

//userReviewGet
app.get("/reviews", async (req, res) => {
  const result = await reviews.find({}).toArray();
  res.json(result);
});




//users functionalities

app.put("/users", async (req, res) => {
  const user = req.body;
  const filter = { email: user.email };
  const option = { upsert: true };
  const updateDoc = { $set: user };
  const result = await users.updateOne(filter, updateDoc, option);
  res.json(result);
});

//Set Admin Role
app.put("/users/admin", async (req, res) => {
  const user = req.body;
  console.log(user);
  const filter = { email: user.email };
  const updateDoc = { $set: { role: "admin" } };
  const result = await users.updateOne(filter, updateDoc);
  res.json(result);
});

// check admin for website access (get operation)
app.get("/users/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const user = await users.findOne(query);
  let isAdmin = false;
  if (user?.role === "admin") {
    isAdmin = true;
  }
  res.json({ admin: isAdmin });
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
