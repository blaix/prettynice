# Database Example

Gren does not have native database support (yet).
For now it is recommended to use some form of db-over-http.
In this example I am using [ws4sqlite](https://github.com/proofrock/ws4sqlite) (via [docker](https://germ.gitbook.io/ws4sqlite/documentation/installation/docker)) to query sqlite over HTTP on the backend,
and [prisma](https://www.prisma.io/) for database migrations and seeding
(via the [getting started](https://www.prisma.io/docs/getting-started) guide).

* See [`server/src/Main.gren`](server/src/Main.gren) for querying the db over ws4sqlite.
* See [`package.json`](package.json) for the prisma and ws4sqlite integration.

## Running this example project (dev)

With [docker](https://www.docker.com/) or [docker desktop](https://www.docker.com/products/docker-desktop/) running:

```
npm install
npm run dev
```

This will spin up the prettynice dev server that auto-rebuilds on file change,
and a docker container running ws4sqlite pointed at `prisma/dev.db` that will be removed when you stop the npm process.

(running in prod TBD, but the short version is `npx prettynice build --optimize && npm start` for the app,
and a more resiliant and [secure](https://germ.gitbook.io/ws4sqlite/security) ws4sqlite setup for the db)

## What about ports?

_If you aren't familiar with ports, see [this elm guide](https://guide.elm-lang.org/interop/ports), which also applies to gren._

You could interface directly with prisma using server-side ports, but it
introduces some extra complexity due to the decoupled nature of ports.

To query a database over ports, you'll need both an outgoing port for the
query, and an incoming port for the result. But because ports are Cmds, you
can't have both in the same update cycle. So you need a way to save the
response to send later when you receive the results. This means you need to
give each request a unique ID, map that to a response on your model, pass it
through the ports, and make extra-sure you are handling errors properly in your
js so you don't end up with dangling requests.

Future versions of prettynice and/or gren will have a better way to call js
with a Task-like interface that is composable, but until then, **I recommend
sticking with this or another form of db-over-http** so you can keep all your
db interaction logic in gren.

For a database-over-ports example, see [examples/v1/database-ports](/examples/v1/database-ports).
