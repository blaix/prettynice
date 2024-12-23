const socket = new WebSocket("ws://localhost:8080");

export function init(component) {
    socket.addEventListener("message", (event) => {
        component.ports.gotMessage.send(event.data);
    });
}

