# Database Example

This is an example of using an sqlite database with [prettynice](https://github.com/blaix/prettynice).

For migrations, it uses [dbmate](https://github.com/amacneil/dbmate).

For communicating with the database, it uses [gren-ws4sql](https://github.com/blaix/gren-ws4sql).

See [package.json](package.json) for how this is orchestrated.

See [`server/src/Main.gren`](server/src/Main.gren) for the relevant code.

## Running this example project (dev)

```
npm install
npm run dev
```

This will spin up the prettynice dev server that auto-rebuilds on file change,
and a ws4sql server pointed at `db/dev.db`
(see [`package.json`](package.json) for details).
