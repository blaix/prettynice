# Client-side Component Example

Example of using client-side components.

Your components should live in `client/src/Components`.

They should export a `component` function that matches [`Browser.element`](https://packages.gren-lang.org/package/gren-lang/browser/version/3.0.0/module/Browser#element) type signature.

They should define a record type alias named `Props` and take that as the first argument to `init`.
For example:

```elm
type alias Props =
    { name : String
    , age : Int
    }

init : Props -> { model : Model, command : Cmd Msg }
init props =
    { model = { user = props }
    ...
```

Prettynice will look for this Props record and use it to generate a corresponding `init` for this component on the server-side
that you can use to embed it in your server-side HTML, passing in server-side data that will be type-checked at compile time and automatically encoded at runtime.
For example:

```elm
Response.sendHtml
    { body =
        Html.div [] 
            [ MyComponent.init
                { name = "Justin"
                , age = 42
                }
            ...
```

See [`server/src/Main.gren`](server/src/Main.gren) and [`client/src/Components`](client/src/Components) for working example.
Run with:

```
npm install
npm start
```

**WARNING: Prop handling is still exploratory and a work in progress.**
Only certain types are supported, and the parsing is still naive.
