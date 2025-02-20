const ws = require("ws");
const wss = new ws.WebSocketServer({ port: 8080 });

exports.init = async (app) => {
    // Subscribe to the broadcast port defined in server/src/Main.gren
    // This is where the server will send new messages posted from clients.
    app.ports.broadcast.subscribe((message) => {
        for (const client of wss.clients) {
            if (client.readyState === ws.OPEN) {
                client.send(message)
            }
        }
    });
};
