const http = require("http");

const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
    if (req.url === "/health") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            status: "ok"
        }));

        return;
    }

    res.writeHead(200, {
        "Content-Type": "text/plain"
    });

    res.end("K.K Live Server is RUNNING!");
});

server.listen(PORT, "0.0.0.0", () => {
    console.log("=================================");
    console.log("K.K Live Server is RUNNING!");
    console.log("PORT:", PORT);
    console.log("=================================");
});
