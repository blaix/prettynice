# Websocket Example

Minimal chat app in [Gren](https://gren-lang.org/) with [Prettynice](https://prettynice.dev/) using websockets.

Gren does not support websockets directly, so we're interfacing with the websocket API through [ports](https://gren-lang.org/book/applications/ports/).

The important files:

* [`server/src/Main.gren`](./server/src/Main.gren): The server. Handles GET requests to the homepage and POST requests with new chat messages. It initializes the Chat component with all messages saved in memory (a real app will want to persist them on a filesystem or db).
* [`server/src/ports.js`](./server/src/ports.js): This is where you can connect to server-side ports in prettynice. In our case we're connecting to a `broadcast` port so the server can send new messages to all connected clients.
* [`client/src/Components/Chat.gren`](./client/src/Components/Chat.gren): Client-side chat component that shows all messages and a field to send new ones.
* [`client/src/Components/Chat.js`](./client/src/Components/Chat.js): Prettynice recognizes `.js` files with the same path and name as `.gren` files in the `Components` directory, letting you connect client-side ports. In our case we're using this to connect to new messages from the websocket server and send them to the chat component.

## Running the app

Copy the entire contents of this directory.
[degit](https://github.com/Rich-Harris/degit) is great for this: `degit blaix/prettynice/examples/v2/websockets mysite`

Then:

```
npm install
npm run dev
```
