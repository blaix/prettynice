# Pretty Nice Framework

A purely functional, fully type-safe, full-stack web framework for [Gren](https://gren-lang.org/).

Your code runs on the server, but your responses can include fully-interactive, client-side components that run in the browser.
Initialize those components with data server-side and you don't have to deal with loading states or data fetching errors.

Follow [@blaix@hachyderm.io](https://hachyderm.io/@blaix) or check the [gren zulip](https://gren.zulipchat.com/) for updates.

## Table of Contents

<!-- vim-markdown-toc GFM -->

* [Installation](#installation)
* [Basic Example](#basic-example)
* [Server-side HTML](#server-side-html)
* [Client-side Components](#client-side-components)
* [Forms](#forms)
* [Static assets](#static-assets)
* [Customizing `<head>`](#customizing-head)
* [Javascript Interop in the Browser](#javascript-interop-in-the-browser)
* [More Control](#more-control)
* [Javascript Interop in Node](#javascript-interop-in-node)
* [Databases](#databases)
* [Deployment](#deployment)
* [Goals](#goals)
* [Inspiration](#inspiration)
* [Working on the Framework Locally](#working-on-the-framework-locally)

<!-- vim-markdown-toc -->

## Installation

[Nodejs](https://nodejs.org/) 18 or higher is required. Unfortunately, a POSIX system (e.g. linux, mac) is also required for now.

```
mkdir mysite
cd mysite
npx prettynice init
```

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
        { host = "127.0.0.1"
        , port_ = 3000
        , env = env
        }


router : Request -> Response -> Cmd msg
router request response =
    case request.path of
    
        [] ->
            Response.sendText "Hello!" response
            -- You can also sendHtml, sendJson, and sendBytes
            -- see examples/[version]/content-types
            
        [ "hello", name ] ->
            Response.sendText ("Hello, " ++ name) response

        _ ->
            response
                |> Response.setStatus 404
                |> Response.sendText "Oops!"
```

See [examples/v1/routing/server/src/Main.gren](https://github.com/blaix/prettynice/tree/main/examples/v1/routing/server/src/Main.gren).

## Server-side HTML

[html-gren](https://packages.gren-lang.org/package/icidasset/html-gren) is used to render HTML on the server.

For example:

```elm
Response.sendHtml
    { title = "Home"
    , head = []
    , body =
        [ h1 [] [ text "Welcome!" ]
        , p [] [ text "It's a website!" ]
        ]
    }
```

See [examples/v1/content-types/server/src/Main.gren](https://github.com/blaix/prettynice/tree/main/examples/v1/content-types/server/src/Main.gren).

## Client-side Components

You can create client-side components for [islands](https://www.patterns.dev/vanilla/islands-architecture/) of interactivity.

Under the hood, components wrap [`Browser.element`](https://packages.gren-lang.org/package/gren-lang/browser/version/3.0.0/module/Browser#element).
They follow the [Elm Architecture](https://guide.elm-lang.org/architecture/) (Model/View/Update).
If you aren't familiar, you can read [this guide](https://elmprogramming.com/model-view-update-part-1.html), which applies to gren as well.

```elm
-- client/src/Components/Counter.gren

module Components.Counter exposing (component, Model, Msg, Props)

import Prettynice

component : Prettynice.Component Props Model Msg
component =
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }

-- Model holds component state
type alias Model =
    { count : Int }

-- Props define the arguments passed in to your component
type alias Props =
    { start : Int }

-- A corresponding init will be generated server-side
-- that takes Props and renders the js for this component.
init : Props -> { model : Model, command : Cmd Msg }
init props =
    { model = { model | count = props.start }
    , command = Cmd.none
    }

type Msg
    = Increment
    | Decrement

update : Msg -> Model -> { model : Model, command : Cmd Msg }
update msg model =
    case msg of
        Increment ->
            { model = { model | count = model.count + 1
            , command = Cmd.none
            }
        Decrement ->
            { model = { model | count = model.count - 1
            , command = Cmd.none
            }

view : Model -> Html Msg
view model =
    p []
        [ button
            [ onClick Decrement ]
            [ text "-" ]
        , text <| String.fromInt model.count
        , button
            [ onClick Increment ]
            [ text "+" ]
        ]

subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
```

See [examples/v1/client-side-components/client/src/Components/Counter.gren](https://github.com/blaix/prettynice/tree/main/examples/v1/client-side-components/client/src/Components/Counter.gren).

Dropping a component in `client/src/Components/` makes it available to embed in
your server-side HTML:

```elm
-- in server/src/Main.gren:

import Gen.Components.Counter as Counter

myResponse =
    Response.sendHtml
        { title = "Component Example"
        , head = []
        , body =
            -- Counter.init takes Props as defined in the Counter component,
            -- and returns HTML/JS to render the component,
            -- including automatic encoding of the props.
            
            [ p [] [ text "Counter starting at zero:" ]
            , Counter.init { start = 0 }
            
            , p [] [ text "Counter starting at not zero:" ]
            , Counter.init { start = 123 }
            ]
    }
```

See [examples/v1/client-side-components/server/src/Main.gren](https://github.com/blaix/prettynice/tree/main/examples/v1/client-side-components/server/src/Main.gren).

Because you can initialize your client-side components with data from the
server, **you don't need loading states or encoders, and the data will be
type-checked at compile time.**

Note: This is still a work-in-progress, and only works with certain types. See
[examples/v1/client-side-components/README.md](https://github.com/blaix/prettynice/tree/main/examples/v1/client-side-components/README.md)
for details.

## Forms

Normal `<form>` elements with `action="post"` will have the data available at `request.formData`:

It is a `FormData` value which is a mapping of field names to arrays of values.

You can use `get` to get a `Maybe String` of the first value associated with a field name,
or `getAll` to get an `Array String` of all values associated with the field name.
For example:

```elm
viewForm =
    H.form 
        [ A.method "post", A.action "/submission" ]
        [ H.div []
            [ H.label [] 
                [ H.text "Name: " 
                , H.input [ A.type_ "text", A.name "name" ] []
                ]
            ]
        , H.div []
            [ H.text "Hobbies: "
            , H.label []
                [ H.text "Clocks"
                , checkbox "hobbies" "clocks"
                ]
            , H.label []
                [ H.text "Empathy"
                , checkbox "hobbies" "empathy"
                ]
            , H.label []
                [ H.text "Bugs"
                , checkbox "hobbies" "bugs"
                ]
            ]
        , H.div []
            [ H.input [ A.type_ "submit", A.value "Submit" ] []
            ]
        ]

viewResult request =
    let
        name =
            FormData.get "name" request.formData
                |> Maybe.withDefault "Mr. E"

        hobbies =
            FormData.getAll "hobbies" request.formData
                |> String.join ", "
    in
    H.text <|
        name ++ " likes: " ++ hobbies
``` 

See [examples/v1/forms](https://github.com/blaix/prettynice/tree/main/examples/v1/forms) for a full working example.

## Static assets

Any files in `public/` will be copied to `dist/client` and available at the
root url path.

See [examples/v1/static-assets](https://github.com/blaix/prettynice/tree/main/examples/v1/static-assets) for a full working example.

## Customizing `<head>`

If you want to add style sheets or other tags to head, `sendHtml` accepts an
array of `Html` elements that will be added to the `<head>` tag
alongside the built-in Prettynice head tags:

```elm
Response.sendHtml
    { title = title
    , body = body
    , head =
        [ Html.link 
            [ Attributes.rel "stylesheet"
            , Attributes.href "/css/my-styles.css"
            ]
        ]
    }
```

See [examples/v1/static-assets](https://github.com/blaix/prettynice/tree/main/examples/v1/static-assets) for a full working example.

## Javascript Interop in the Browser

You can drop a js file with the same base name as a component
in `client/src/Components` and it will be automatically imported.
If you export an `init` function it will be called with the initialized component, allowing you to connect ports.

If you aren't familiar with ports, you can read [this section of the elm guide](https://guide.elm-lang.org/interop/ports), which also applies to gren.

```js
// client/src/Components/Alert.js

export function init(component) {
    component.ports.sendAlert.subscribe(function(message) {
        alert(message);
    });
}
```

```elm
-- client/src/Components/Alert.gren

port sendAlert : String -> Cmd msg

update msg model =
    case msg of
        ClickedAlert ->
            { model = model
            , command = sendAlert "Danger! High voltage!"
            }
```

See [examples/v1/client-side-ports](https://github.com/blaix/prettynice/tree/main/examples/v1/client-side-ports) for a full working example.

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

* [examples/v1/running-tasks](/examples/v1/running-tasks)
* [examples/v1/running-commands](/examples/v1/running-commands)
* [examples/v1/server-side-state](/examples/v1/server-side-state)
* [examples/v1/server-side-ports](/examples/v1/server-side-ports)
* [examples/v1/database-ports](/examples/v1/database-ports)

## Javascript Interop in Node

You can drop a `ports.js` file in `server/src` and export an `init` function to
connect ports between node and your gren program,
giving you a type-safe interface to the entire node ecosystem.

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

See:

* [examples/v1/server-side-ports](https://github.com/blaix/prettynice/tree/main/examples/v1/server-side-ports).
* [examples/v1/database-ports](https://github.com/blaix/prettynice/tree/main/examples/v1/database-ports).

## Databases

Gren does not yet have a way to natively connect to a database.
Currently I recommend using some form of db-over-http.

See [examples/v1/next/database](https://github.com/blaix/prettynice/tree/main/examples/v1/next/database) for a working example of doing this with sqlite.

You could do this with ports as well, but there are caveats.
See [Why not ports?](https://github.com/blaix/prettynice/tree/main/examples/v1/next/database/README.md#why-not-ports) in the example README.

## Deployment

The basic steps for deployment are:

1. Build with optimizations: `npx prettynice build --optimize`
2. Deploy the `dist` folder.
3. Run with: `node dist/server/index.js`

If you cloned one of the examples,
there are scripts for the build and run steps:

* `npm run build`
* `npm start`

## Goals

### Short term goals

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

### Long term goals

* Batteries included:
  * Type-safe UI styling using web standards (HTML/CSS)
  * Sessions and authentication
  * Configuration and secrets
  * Data persistence
* Move slow and fix things.

### Anti-goals / Avoiding

* SPA
* Nested components
* Serverless. Targeting the cloud.
* The possibility of unhandled runtime errors
* The need for runtime error handling
  
### Personal goals

I'm selfishly building this to power <https://pencils.dev/>.
Goals and anti-goals are driven by the DX and UX of this project.

## Inspiration

* [Remix](https://remix.run/): Web standards. Use the platform.
* [Fresh](https://fresh.deno.dev/): Static HTML with islands of interactivity.
* [Rails](https://rubyonrails.org/): Developer happiness. Batteries included.
* [Elm Land](https://elm.land/): The good parts of Rails (guides & conventions, beginner-friendliness, batteries included) applied to a type-safe, purely functional language.

## Working on the Framework Locally

If you're using nix, there's a [`shell.nix`](/shell.nix) to start a nix shell with everything you need.

Otherwise, you'll need to manually [install gren](https://gren-lang.org/install),
and then look at the `buildInputs` list in `shell.nix` for other things you'll need
(you can ignore `bashInteractive`),

### Important Directories

* `src/`: Source files for the gren package.
* `cli/`: The CLI. Gren source files are under `cli/src/` and are built to `cli/bin/`.
* `website/`: The prettynice website.
* `examples/`: Several working examples of prettynice sites exercising various features.

### Running examples

You can `cd` to a directory under [`examples/`](https://github.com/blaix/prettynice/tree/main/examples) and run `npm start`,
or use [`just`](https://github.com/casey/just) from the root of the repo:

* Run a single example with `just example [EXAMPLE NAME]` (e.g. `just example hello-world`).
* Iterate through all the examples with `just examples`.
  Ctrl-c to kill the current example and start the next one.
  Great for testing.

See [`Justfile`](/Justfile) for details.
