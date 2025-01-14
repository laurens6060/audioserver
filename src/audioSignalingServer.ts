import * as http from "http";
import * as WebSocket from "ws";

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Extend the WebSocket interface to include custom properties
interface CustomWebSocket extends WebSocket {
    id?: string;
}

wss.on("connection", (ws: CustomWebSocket) => {
    console.log("New client connected");

    ws.on("message", (message: WebSocket.RawData) => {
        try {
            const parsedMessage = JSON.parse(message.toString());

            if (parsedMessage.type === "signal") {
                const { targetId, data } = parsedMessage;
                wss.clients.forEach((client) => {
                    const customClient = client as CustomWebSocket;
                    if (
                        client.readyState === WebSocket.OPEN &&
                        customClient.id === targetId
                    ) {
                        customClient.send(JSON.stringify({ type: "signal", data }));
                    }
                });
            } else if (parsedMessage.type === "register") {
                ws.id = parsedMessage.id;
                console.log(`Client registered with ID: ${ws.id}`);
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

// Start the server on port 8080
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`WebSocket server is running on port ${PORT}`);
});