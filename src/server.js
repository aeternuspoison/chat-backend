const http = require("http");
const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8080;

console.log("=================================");
console.log("INICIANDO BACKEND");
console.log("PORT:", PORT);
console.log("=================================");

const httpServer = http.createServer((req, res) => {
    console.log(`HTTP: ${req.method} ${req.url}`);

    if (req.url === "/") {
        res.writeHead(200, {
            "Content-Type": "text/plain; charset=utf-8"
        });

        res.end("Backend funcionando!");
        return;
    }

    res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("Not Found");
});

const server = new WebSocketServer({
    server: httpServer
});

server.on("connection", (ws) => {
    console.log("=================================");
    console.log("CLIENTE CONECTADO");
    console.log("=================================");

    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });

    ws.on("message", (message) => {
        const messageText = message.toString();

        console.log("Message:", messageText);

        server.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(messageText);
            }
        });
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

httpServer.listen(PORT, () => {
    console.log("=================================");
    console.log(`HTTP/WebSocket server running on port ${PORT}`);
    console.log("=================================");
});