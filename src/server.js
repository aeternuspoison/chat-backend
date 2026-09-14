const http = require("http");
const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8080;

const httpServer = http.createServer((req, res) => {
    if (req.url === "/") {
        res.writeHead(200, {
            "Content-Type": "text/plain"
        });

        res.end("Backend funcionando!");
        return;
    }

    res.writeHead(404);
    res.end("Not Found");
});

const server = new WebSocketServer({
    server: httpServer
});

server.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });

    ws.on("message", (message) => {
        console.log("Message:", message.toString());

        server.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(message.toString());
            }
        });
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

httpServer.listen(PORT, () => {
    console.log(`HTTP/WebSocket server running on port ${PORT}`);
});