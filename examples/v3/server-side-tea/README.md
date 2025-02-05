# Server Side TEA

This is an example of using the full [Elm Architecture](https://gren-lang.org/book/applications/tea/) with Prettynice.

Instead of just routing requests, it also gets the existingt time zone, and has a subscription to update the server-side model with the current time.

See [`server/src/Main.gren`](server/src/Main.gren)

Run with:

```
npm install
npm run dev
```
