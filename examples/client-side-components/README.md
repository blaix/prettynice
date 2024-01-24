# Client-side Component Example

Example of using client-side components, which are wrappers around a `Browser.element` that you can drop into your server-side HTML.
Flags are passed in from the server, type-checked at compile-time, and automatically encoded.

**The automatic encoding is still a work in progress.**
Parsing the component type signature is still very naive, and only works for a limited set of types.
If the signature can't be parsed, or you use an unsupported type for the flags, you will get a (hopefully helpful) compile error.

See [`server/src/Main.gren`](server/src/Main.gren) and [`client/src/Components`](client/src/Components).

```
npm install
npm start
```
