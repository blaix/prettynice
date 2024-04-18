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

## Why not ports?

_If you aren't familiar with ports, see [this elm guide](https://guide.elm-lang.org/interop/ports), which also applies to gren._

You could interface directly with prisma using server-side ports, but it would introduce a lot of complexity and make things brittle.

This is because there is no way to treat an outgoing and incoming port as a single synchronous pair.
That means in your request handler you'd have to trigger the port for the query,
  passing some identifier to tie it to this request,
  save the response object on your model with that same identifier,
  send the correct response when you receive the results through anohter port message,
  making extra sure your js error handling is tight to not leave a dangling request.

A future version of prettynice should have a way to do this through a
Task-like interface that will let you run the query as a task, map the result,
andThen send the response as a single pipeline in your request handler.
