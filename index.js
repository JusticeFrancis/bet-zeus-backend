require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ test route
app.get("/sr", (req, res) => {
  res.send("Hello World!");
});

// ✅ mount router
const router = require("./routes");
app.use("/", router);

// ✅ listen
const PORT = process.env.PORT || 7001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});