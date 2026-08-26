const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("K.K Live Server is RUNNING!");
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
