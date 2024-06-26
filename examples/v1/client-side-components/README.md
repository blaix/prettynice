# Client-side Component Example

Example of using client-side components.

Your components should live in `client/src/Components`.

Components work just like a [`Browser.element`](https://packages.gren-lang.org/package/gren-lang/browser/version/3.0.0/module/Browser#element),
but instead of a `main`, they export a `component` function that returns a [`Prettynice.Component`](https://github.com/blaix/prettynice/blob/main/src/Prettynice/Component.gren).

They should also have a `Props` record type.
This will define the interface for `init`.
It's similar to [Flags in elm](https://guide.elm-lang.org/interop/flags),
but the data is passed in when you init the component on the server.

See [`client/src/Components/Counter.gren`](client/src/Components/Counter.gren) for an example component,
and [`server/src/Main.gren`](server/src/Main.gren) for how it's used on a page.

Run this example with:

```
npm install
npm run dev
```

**Note:** Prettynice has a parser that looks for your Props to generate the corresponding server-side types and encoders,
so it must be a [record](https://gren-lang.org/book/syntax/records.html) named `Props`,
and only contain fields with types that match one of the corresponding variants of [Prettynice.Internal.Props.FieldType](https://github.com/blaix/prettynice/blob/main/src/Prettynice/Internal/Props.gren).

But don't worry, if you color outside the lines (mess up the name, type
signature, use an unsupported type, etc), you will get an error in the build
step - _not_ at runtime. If a Props mistake is not caught at build time, or if
the error is confusing or unhelpful, please
[file an issue](https://github.com/blaix/prettynice/issues), thanks!

