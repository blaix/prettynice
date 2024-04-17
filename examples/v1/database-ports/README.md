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
