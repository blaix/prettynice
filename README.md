# Pretty Nice Framework

A purely functional, fully type-safe, full-stack web framework for [Gren](https://gren-lang.org/).

**In early proof of concept stage!**

Things are still very foundational.
Currently working on the API and what level of control the framework should have over your app.

## Basic Example

```elm
module Main exposing (main)

import Node exposing (Environment)
import Prettynice.SimpleRouter as Router
import Prettynice.Request exposing (Request)
import Prettynice.Response as Response exposing (Response)


main : Router.Program
main =
    Router.defineProgram
        { init = init
        , router = router
        }


init : Environment -> Router.Init
init env =
    Router.startProgram
        { host = "0.0.0.0"
        , port_ = 3000
        , env = env
        }


router : Request -> Response -> Cmd msg
router request response =
    case request.path of
        [] ->
            Response.sendText "Hello!" response
            -- You can also sendHtml and sendJson
            -- see examples/content-types
            
        [ "hello", name ] ->
            Response.sendText ("Hello, " ++ name) response

        _ ->
            response
                |> Response.setStatus 404
                |> Response.sendText "Oops!"
```

See [examples/routing/server/src/Main.gren](examples/routing/server/src/Main.gren).

## Server-side HTML

[html-gren](https://packages.gren-lang.org/package/icidasset/html-gren) is used to render HTML on the server.

For example:

```elm
Response.sendHtml
    { title = "Home"
    , body =
        Html.main_ []
            [ Html.h1 [] [ Html.text "Welcome!" ]
            , Html.p [] [ Html.text "It's a website!" ]
            ]
    }
```

See [examples/content-types/server/src/Main.gren](examples/content-types/server/src/Main.gren).

## Client-side Components

You can create client-side components for [islands](https://www.patterns.dev/vanilla/islands-architecture/) of interactivity.

Under the hood, components wrap [`Browser.element`](https://packages.gren-lang.org/package/gren-lang/browser/version/3.0.0/module/Browser#element).
They follow the [Elm Architecture](https://guide.elm-lang.org/architecture/) (Model/View/Update).
If you aren't familiar, you can read [this guide](https://elmprogramming.com/model-view-update-part-1.html), which applies to gren as well.

```elm
-- client/src/Components/Counter.gren

component =
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }

type alias Model =
    Int

init start =
    { model = start, command = Cmd.none }

type Msg
    = Increment
    | Decrement

update msg model =
    case msg of
        Increment ->
            { model = model + 1, command = Cmd.none }
        Decrement ->
            { model = model - 1, command = Cmd.none }

view model =
    Html.p []
        [ Html.button
            [ Events.onClick Decrement ]
            [ Html.text "-" ]
        , Html.text <| String.fromInt model
        , Html.button
            [ Events.onClick Increment ]
            [ Html.text "+" ]
        ]

subscriptions _ =
    Sub.none
```

See [examples/client-side-components/client/src/Components/Counter.gren](examples/client-side-components/client/src/Components/Counter.gren).

Dropping a component in `client/src/Components/` makes it available to embed in your server-side HTML:

```elm
-- in server/src/Main.gren:

Response.sendHtml
    { title = "Component Example"
    , body =
        H.main_ []
            [ H.p [] [ H.text "Counter starting at zero:" ]
            , Counter.init 0
            , H.p [] [ H.text "Counter starting at not zero:" ]
            , Counter.init 123
            ]
    }
```

See [examples/client-side-components/server/src/Main.gren](examples/client-side-components/server/src/Main.gren).

Because you can initialize your client-side components with data from the server, **you don't need loading states or encoders, and the data will be type-checked at compile time.**

Note: This is still a work-in-progress, and only works with certain types. See [examples/client-side-components/README.md](examples/client-side-components/README.md) for details.

## More Control

The examples above use `Prettynice.SimpleRouter` to define a router, and let the framework handle wiring it up to a full program.
If you need more control over the app, you can define a full program instead of a router:

```elm
main =
    Prettynice.defineProgram
        { init = init
        , update = update
        , subscriptions = subscriptions
        , onRequest = GotRequest
        }
```

This gives you more control over the msg/update cycle, so you can do side-effecty things, like read files for example:

```elm
update msg model =
    case msg of
        GotRequest request response ->
            { model = model
            , command =
                open model.fsPermission "./test.txt"
                    |> Task.andThen read
                    |> Task.andThen decode
                    |> Task.attempt (GotReadResult response)
            }

        GotReadResult response (Ok fileContents) ->
            { model = model
            , command =
                response
                    |> Response.sendText
                        ("File contents: " ++ fileContents)
            }

        GotReadResult response (Err e) ->
            { model = model
            , command =
                response
                    |> Response.setStatus 500
                    |> Response.sendText
                        ("Failed to read file: " ++ Debug.toString e)
```

See:

* [examples/running-tasks](examples/running-tasks)
* [examples/running-commands](examples/running-commands)
* [examples/server-side-state](examples/server-side-state)

## Nodejs Interop

You can drop a `ports.js` file in `server/src` to send and subscribe to messages to/from your gren program.

If you aren't familiar with ports, you can read [this section of the elm guide](https://guide.elm-lang.org/interop/ports), which also applies to gren.

```js
// server/src/ports.js

const crypto = require("crypto");

exports.init = async function(app) {
    app.ports.getUuid.subscribe(function() {
        app.ports.receiveUuid.send(
            crypto.randomUUID()
        );
    });
};
```

```elm
-- server/src/Main.gren

type alias Model =
    { response : Maybe Response }

update msg model =
    case msg of
        GotRequest request response ->
            { model = { model | response = Just response }
            , command = getUuid {}
            }

        GotUuid response uuid ->
            { model = { model | response = Nothing }
            , command = Response.sendText uuid response
            }

port getUuid : {} -> Cmd msg
port receiveUuid : (String -> msg) -> Sub msg

subscriptions : Model -> Sub Msg
subscriptions model =
    case model.response of
        Just response ->
            receiveUuid <| GotUuid response

        Nothing ->
            Sub.none
```

See [examples/server-side-ports](examples/server-side-ports).

## Short term goals

* All content and everything you need for interactivity should be included in the initial page load.
  No loading spinners, no littering your client-side model with Maybes and loading state variants.
* Passing data between server and client should be fully type safe and verified at compile time.
  No hand-written encoders that require runtime error handling.
* Explicit separation of client and server code. 
  No compile-time magic to decide what should be where.
  No accidentally shipping secrets or server-only libraries to the client.
  But this should not interfere with a full stack DX that feels unified and holistic.
* Lean on the platform: Prevent preventDefault as the default.
  Prefer normal browser behavior and HTTP request/response cycles.
  E.g. normal forms that default to normal requests to the server.
  No littering your client-side model and msg to track every field change.
* Progressive enhancement where it would benefit UX, without requiring escape hatches to js.
* Boring code that's easy to change and maintain.

## Long term goals

* Batteries included:
  * Type-safe UI styling using web standards (HTML/CSS)
  * Sessions and authentication
  * Configuration and secrets
  * Data persistence
* Move slow and fix things.

## Anti-goals / Avoiding

* SPA
* Nested components
* Serverless. Targeting the cloud.
* The possibility of unhandled runtime errors
* The need for runtime error handling
  
## Personal goals

I'm selfishly building this to power <https://pencils.dev/>.
Goals and anti-goals are driven by the DX and UX of this project.

## Inspiration

* [Remix](https://remix.run/): Web standards. Use the platform.
* [Fresh](https://fresh.deno.dev/): Static HTML with islands of interactivity.
* [Rails](https://rubyonrails.org/): Developer happiness. Batteries included.
* [Elm Land](https://elm.land/): The good parts of Rails (guides & conventions, beginner-friendliness, batteries included) applied to a type-safe, purely functional language.
