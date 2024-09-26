# Clide Side Ports

An example of browser js interop using ports.

Placing a file that matches your component name, but with a `.js` extension in
`client/src/Components` and exporting `init(app)` will be automatically
recognized and used, allowing you to send and subscribe to ports in the gren
app.

See [`client/src/Components/`](client/src/Components/)
and [`server/src/Main.gren`](server/src/Main.gren).

```
npm install
npm run dev
```
