const ws = require("ws");
const wss = new ws.WebSocketServer({ port: 8080 });

exports.init = async (app) => {
    app.ports.broadcast.subscribe((message) => {
        for (const client of wss.clients) {
            if (client.readyState === ws.OPEN) {
                client.send(message)
            }
        }
    });
};
