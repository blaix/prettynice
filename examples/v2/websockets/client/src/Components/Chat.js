const socket = new WebSocket("ws://localhost:8080");

export function init(component) {
    // Listen for messages from the websocket and send them to the
    // gotMessage port defined in client/src/Components/Chat.gren
    socket.addEventListener("message", (event) => {
        component.ports.gotMessage.send(event.data);
    });
}

