const http = require("http");
const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.writeHead(200, {
            "Content-Type": "text/plain"
        });

        res.end("WebSocket server funcionando!");
        return;
    }

    res.writeHead(404);
    res.end("Not Found");
});

const wss = new WebSocketServer({
    server
});

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });

    ws.on("message", (message) => {
        console.log("Message:", message.toString());

        wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(message.toString());
            }
        });
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});