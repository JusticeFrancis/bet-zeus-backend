require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");


const app = express();

app.use(cors());

app.use(express.json());

// ✅ routes
const router = require("./routes");
app.use(router);

// ✅ test route
app.post("/", (req, res) => {
  console.log(req.body);
  res.send("Hello World!");
});

// ✅ listen
const PORT = process.env.PORT || 7001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

