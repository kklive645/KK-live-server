```javascript
const express = require("express");

const app = express();

const PORT = Number(process.env.PORT) || 10000;

app.get("/", (req, res) => {
    res.status(200).send("K.K Live Server is RUNNING!");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`K.K Live Server running on port ${PORT}`);
});
```
