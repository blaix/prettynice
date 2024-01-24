# Server Side Ports

An example of a response that depends on port communication with the server.

Placing `ports.js` in `server/src/` and exporting `init(app)` will be automatically recognized and used,
allowing you to send and subscribe to ports in the gren app.

See `server/src/ports.js` and `server/src/Main.gren`.

```
npm install
npm start
```
