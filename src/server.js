const { WebSocketServer } = require('ws');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 8080;

const server = new WebSocketServer({
    port: PORT
});

server.on('connection', (ws) => {

    console.log('Client connected');

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    ws.on('message', (message) => {

        console.log('Message:', message.toString());

        server.clients.forEach((client) => {

            if (client.readyState === 1) {
                client.send(message.toString());
            }

        });

    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

});

console.log(`WebSocket server running on port ${PORT}`);