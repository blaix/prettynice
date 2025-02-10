# Client-side Component Example

Example of using client-side components.

Your components should live in `client/src/Components`.

Components work just like a [`Browser.element`](https://gren-lang.org/book/applications/browser/#browserelement),
but instead of a `main`, they export a `component` function that returns a `Prettynice.Component`.

See [`client/src/Components/Counter.gren`](client/src/Components.Counter.gren) for an example component.

A component must have a `Props` record type.
This will define the interface for `init`.
It's similar to [Flags](https://gren-lang.org/book/applications/flags/),
but the data is passed in when you initialize the component on the server.

See [`server/src/Main.gren`](server/src/Main.gren) for how components are initialized with props on the server.

See [the client-side components section of the prettynice doc site](https://v3.prettynice.dev/basics/client/)
for more details.

Run this example with:

```
npm install
npm run dev
```
