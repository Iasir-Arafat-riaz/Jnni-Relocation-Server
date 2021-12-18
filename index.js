const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT||2021;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("jinni relocation is rolling");
});

app.listen(port, () => {
  console.log("running server on port", port);
});
