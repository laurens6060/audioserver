"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const WebSocket = __importStar(require("ws"));
const server = http.createServer();
const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
    console.log("New client connected");
    ws.on("message", (message) => {
        try {
            const parsedMessage = JSON.parse(message.toString());
            if (parsedMessage.type === "signal") {
                const { targetId, data } = parsedMessage;
                wss.clients.forEach((client) => {
                    const customClient = client;
                    if (client.readyState === WebSocket.OPEN &&
                        customClient.id === targetId) {
                        customClient.send(JSON.stringify({ type: "signal", data }));
                    }
                });
            }
            else if (parsedMessage.type === "register") {
                ws.id = parsedMessage.id;
                console.log(`Client registered with ID: ${ws.id}`);
            }
        }
        catch (error) {
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
//# sourceMappingURL=audioSignalingServer.js.map