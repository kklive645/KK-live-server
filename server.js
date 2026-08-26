const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
    res.status(200).send("K.K Live Server is RUNNING!");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        server: "K.K Live Server"
    });
});

app.post("/getToken", (req, res) => {
    res.status(501).json({
        error: "Token endpoint is not configured yet"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`K.K Live Server running on port ${PORT}`);
});
