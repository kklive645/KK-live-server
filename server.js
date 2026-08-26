const http = require("http");

const PORT = process.env.PORT || 10000;

console.log("STARTING K.K LIVE SERVER...");
console.log("PORT =", PORT);

const server = http.createServer((req, res) => {
    console.log("REQUEST:", req.url);

    res.writeHead(200, {
        "Content-Type": "text/plain"
    });

    res.end("K.K Live Server is RUNNING!");
});

server.listen(PORT, "0.0.0.0", () => {
    console.log("================================");
    console.log("K.K LIVE SERVER STARTED");
    console.log("LISTENING ON PORT:", PORT);
    console.log("================================");
});

server.on("error", (error) => {
    console.error("SERVER ERROR:", error);
});
