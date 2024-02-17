# Client-side Component Example

Example of using client-side components.

Your components should live in `client/src/Components`.

They should export a `component` function that returns a [`Prettynice.Component`](https://github.com/blaix/prettynice/blob/main/src/Prettynice/Component.gren).

They should define a record type alias named `Props` and take that as the first argument to `init`.
For example:

```elm
type alias Props =
    { darkMode : Bool
    }

init : Props -> { model : Model, command : Cmd Msg }
init props =
    { model = 
        { darkMode = props.darkMode
        ...
```

Prettynice will look for this Props record and use it to generate a
server-side version of the component that you can embed in your server-side HTML.
For example, if you have a `client/src/Components/DarkModeToggle.gren`, you can do
this in your `server/src/Main.gren`:


```elm
import Gen.Components.DarkModeToggle as DarkModeToggle

...

Response.sendHtml
    { body =
        [ header []
            [ h1 [] [ text "Welcome" ]
            , DarkModeToggle.init
                { darkMode = user.darkModePreference }
            ]
        ...
```

See [`server/src/Main.gren`](server/src/Main.gren) and [`client/src/Components`](client/src/Components) for working example.
Run with:

```
npm install
npm start
```

**Note:** Prettynice has a parser that looks for your Props to generate the corresponding server-side types and encoders,
so it must be a [record](https://gren-lang.org/book/syntax/records.html) named `Props`,
and only contain fields with types that match one of the corresponding variants of [Prettynice.Props.FieldType](https://github.com/blaix/prettynice/blob/main/src/Prettynice/Props.gren).
There are plans to support more, but at the time of writing this README, only String, Int, Float, and Bool are supported.

But don't worry, if you color outside the lines (mess up the name, type signature, use an unsupported type, etc), you will get a compile error.
If you don't, or if the error is confusing or unhelpful, please [file an issue](https://github.com/blaix/prettynice/issues), thanks!

