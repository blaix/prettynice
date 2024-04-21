# Database Example

Gren does not have native database support (yet).
But you have access to the entire node ecosystem through ports.
If you aren't familiar with ports, you can read [this section of the elm guide](https://guide.elm-lang.org/interop/ports), which also applies to gren.

If you create `server/src/ports.js` it will be automatically imported.
If it exports an `init` function it will be called with the initialized gren program,
alowing you to connect your ports.

In this example I'm using ports to talk to a database using [prisma](https://www.prisma.io/).
I set it up using the [prisma getting started guide](https://www.prisma.io/docs/getting-started).

See [`server/src/ports.js`](server/src/ports.js) for the db query
and [`server/src/Main.gren`](server/src/Main.gren) for how it's used in gren.
See [`package.json`](package.json) for the migrate and seed hooks into prisma.

Run the project from this directory with:

```
npm install
npm run dev
```
## Server-side Port Caveats

Using ports when your response depends on the result of that port introduces a
lot of exta complexity. You need both an outgoing port for the call to js, and
an incoming port for the result. But because ports are Cmds, you can't have
both in the same update cycle. So you need a way to save the response to send
later when you receive the results. This means you need to give each request a
unique ID, map that to a response on your model, pass it through the ports, and
make extra-sure you are handling errors properly in your js so you don't end up
with dangling requests.

Future versions of prettynice and/or gren will have a better way to call js
with a Task-like interface that is composable, but until then, **I recommend
using some form of [db-over-http](/examples/v1/database-http)** so you can keep
all your db interaction logic in gren.
