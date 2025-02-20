# Database Example

Gren does not have native database support (yet).
For now it is recommended to use some form of db-over-http.
In this example I am using [ws4sqlite](https://github.com/proofrock/ws4sqlite)
to query sqlite over HTTP on the backend.

See [`server/src/Main.gren`](server/src/Main.gren).

## Running this example project (dev)

```
npm install
npm run dev
```

This will spin up the prettynice dev server that auto-rebuilds on file change,
and a ws4sql server pointed at `db/dev.db`
(see [`package.json`](package.json) for details).
