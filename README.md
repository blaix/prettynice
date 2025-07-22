# Pretty Nice Framework

[#prettynice]: https://discord.gg/TQbw6CcTXG
[Discord]: https://discord.gg/J8aaGMfz

A purely functional, fully type-safe, full-stack web framework for [Gren](https://gren-lang.org/).

Your code runs on the server, but your responses can include fully-interactive, client-side components that run in the browser.
Initialize those components with data server-side and you don't have to deal with loading states or data fetching errors.

Go through this README to learn about the framework and how to get started.
Then check out the [docsite](https://prettynice.dev/), [examples](https://github.com/blaix/prettynice/tree/main/examples), and [API docs](https://packages.gren-lang.org/package/blaix/prettynice) for more details.

There's an [intro video](https://www.youtube.com/watch?v=gZCOZ9tuArU) and a [demo of using prettynice with a database](https://www.youtube.com/watch?v=Ld1Lc10dO2k) on my youtube channel.

You can follow [@blaix@hachyderm.io](https://hachyderm.io/@blaix) or check the [#prettynice][]
channel on the Gren [Discord][] for updates or to ask for help.

## Table of Contents

* [Installation and Usage](#installation-and-usage)
* [Basic Example](#basic-example)
* [Server-side HTML](#server-side-html)
* [Client-side Components](#client-side-components)
* [Forms](#forms)
* [Static assets](#static-assets)
* [Javascript Interop in the Browser](#javascript-interop-in-the-browser)
* [Javascript Interop in Node](#javascript-interop-in-node)
* [Databases](#databases)
* [Deployment](#deployment)
* [Goals](#goals)
* [Inspiration](#inspiration)
* [More Info](#more-info)
* [Working on the Framework Locally](#working-on-the-framework-locally)

## Installation and Usage

[Nodejs](https://nodejs.org/) 20 or higher is the only requirement.

Create a starter project with:

```
mkdir mysite
cd mysite
npx prettynice init
```

Then you can run the dev server with: `npm run dev`

## Basic Example

A basic Prettynice website needs a `main` entry point, an `init` function to start your server, and a `router` function to handle requests:

```elm
module Main exposing (main)

import Node exposing (Environment)
import Prettynice
import Prettynice.Request exposing (Request)
import Prettynice.Response as Response exposing (Response)
import Task exposing (Task)

main : Prettynice.Program Model {}
main =
    Prettynice.defineProgram
        { init = init
        , router = router
        }

type alias Model = {}

init : Environment -> Prettynice.Init Model {}
init env =
    Prettynice.startProgram
        { env = env
        , host = "127.0.0.1"
        , port_ = 3000
        , model = {}
        }

router : Model -> Request -> Response msg -> Task Never (Response msg)
router model request response =
    response
        |> Response.asText "Hello!"
        |> Task.succeed
```

See [the examples folder](https://github.com/blaix/prettynice/tree/main/examples)
for more complex examples including routing, styling, interacting with databases, and more.

## Server-side HTML

[html-gren](https://packages.gren-lang.org/package/icidasset/html-gren) is used to render HTML on the server.

```elm
Response.asHtml
    { title = "Home"
    , head = []
    , body =
        [ h1 [] [ text "Welcome!" ]
        , p [] [ text "It's a website!" ]
        ]
    }
```

See [examples/v3/html/server/src/Main.gren](https://github.com/blaix/prettynice/tree/main/examples/v3/html/server/src/Main.gren)
for a full working example.

## Client-side Components

You can create client-side components for [islands](https://www.patterns.dev/vanilla/islands-architecture/) of client-side interactivity.
They are initialized on the server, so you can pass in data without needing a client-side fetch
(and all the loading state / error handling that goes along with it).

Under the hood, components wrap [`Browser.element`](https://packages.gren-lang.org/package/gren-lang/browser/version/latest/module/Browser#element).
They follow the [Elm Architecture](https://gren-lang.org/book/applications/tea/) (Model/View/Update).

```elm
-- client/src/Components/Counter.gren

module Components.Counter exposing (component, Model, Msg, Props)

import Prettynice.Component exposing (Component)
import Transmutable.Html exposing (..)
import Transmutable.Html.Events exposing (..)

component : Component Props Model Msg
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
    when msg is
        Increment ->
            { model = { model | count = model.count + 1 }
            , command = Cmd.none
            }
            
        Decrement ->
            { model = { model | count = model.count - 1 }
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

See [examples/v3/client-side-components/client/src/Components/Counter.gren](https://github.com/blaix/prettynice/tree/main/examples/v3/client-side-components/client/src/Components/Counter.gren).

Dropping a component in `client/src/Components/` makes it available to embed in
your server-side HTML:

```elm
-- in server/src/Main.gren:

import Gen.Components.Counter as Counter

myResponse =
    Response.asHtml
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

See [examples/v3/client-side-components/server/src/Main.gren](https://github.com/blaix/prettynice/tree/main/examples/v3/client-side-components/server/src/Main.gren).

## Forms

Normal `<form>` elements with `action="post"` will have the data available at
[`request.formData`](https://packages.gren-lang.org/package/blaix/prettynice/version/3/module/Prettynice.Request#Request):

It is a [`FormData`](https://packages.gren-lang.org/package/blaix/prettynice/version/3/module/Prettynice.FormData)
value which is a mapping of field names to arrays of values.

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

See [examples/v3/forms](https://github.com/blaix/prettynice/tree/main/examples/v3/forms) for a full working example.

## Static assets

Any files in `public/` will be copied to `dist/client` and available at the
root url path. Images, stylesheets, etc. can then be added to the `head`
and `body` fields of
[`asHtml`](https://packages.gren-lang.org/package/blaix/prettynice/version/3/module/Prettynice.Response#asHtml).

See [examples/v3/static-assets](https://github.com/blaix/prettynice/tree/main/examples/v3/static-assets) for a full working example.

## Javascript Interop in the Browser

You can drop a js file with the same base name as a component
in `client/src/Components` and it will be automatically imported.
If you export an `init` function it will be called with the initialized
component, allowing you to connect [ports](https://gren-lang.org/book/applications/ports/#browser-ports).

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
    when msg is
        ClickedAlert ->
            { model = model
            , command = sendAlert "Danger! High voltage!"
            }
```

See [examples/v3/client-side-ports](https://github.com/blaix/prettynice/tree/main/examples/v3/client-side-ports) for a full working example.

## Javascript Interop in Node

You can drop a `ports.js` file in `server/src` and export an `init` function to
connect server-side [ports](https://gren-lang.org/book/applications/ports/#node-ports),
giving you a type-safe interface to the entire node ecosystem.

Look at [the websockets example](https://github.com/blaix/prettynice/tree/main/examples/v3/websockets)
to see this in action.

## Databases

Until Gren gets native database connection support, you can use ports to connect to a db in node,
or some form of db-over-http to keep all your database code in Gren. See 
[examples/v3/database](https://github.com/blaix/prettynice/tree/main/examples/v3/database)
for an example of doing this with [ws4sql](https://github.com/proofrock/ws4sqlite).

## Deployment

Prettynice should work on any host that supports nodejs services (serverless is not a great option).

If you generated your project with `prettynice init` or cloned one of the [examples](/examples), the basic steps for running in production are:

1. Build: `npm run build:prod` (runs `npx prettynice build --optimize` under the hood). This generates a `dist` folder. `dist/server` holds your node server. `dist/client` holds your static assets.
2. Run with: `npm start` (runs `node dist/server/index.js` under the hood).

Below are some recommendations for hosts that work well with prettynice.

### Fly.io

[Fly.io](https://fly.io/) is a cloud host designed for containerized services that works great with prettynice.

The [quickstart instructions](https://fly.io/docs/getting-started/launch/) should be enough to get your prettynice site up and running.
`fly launch` will recognize your site as a node app and set up the Dockerfile appropriately.

**Note:** If you get errors during the build step about not finding a git binary, add `git-all` to the line that begins `apt-get install` in the generated `Dockerfile` and then `fly deploy` should work.

### Render

[Render](https://render.com/) is another good hosting option for prettynice, especially if you want a more hands-off approach with good support at the paid tiers.

To host a prettynice site on render, on your dashboard, click Add New and select Web Service and then your repository.
On the next step, choose Node as the language, and the rest of the defaults should work fine.

## Goals

### Short term goals

* All content and everything you need for interactivity should be included in the initial page load.
  No loading spinners, no littering your client-side model with Maybes and loading state variants.
* Passing data between server and client should be fully type safe and verified at compile time.
  No hand-written encoders that require runtime error handling.
* Clear separation of client-only and server-only code. 
  No compile-time magic to split things up and decide what should be where.
  No accidentally shipping secrets or server-only libraries to the client.
  _But this should not interfere with a full stack DX that feels unified and holistic._
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

## More Info

For more details on using Prettynice, see:

* [https://prettynice.dev](https://prettynice.dev)
* [API docs](https://packages.gren-lang.org/package/blaix/prettynice)

## Working on the Framework Locally

This project uses [devbox](https://www.jetify.com/devbox).
If you don't want to use devbox, see `devbox.json` for the dependencies you will need to install.

### Important Directories

* `src/`: Source files for the gren package.
* `cli/`: The CLI. Gren source files are under `cli/src/` and are built to `cli/bin/`.
* `website/`: The prettynice website.
* `examples/`: Several working examples of prettynice sites exercising various features.

### Running examples

From the root of the repo with [`just`](https://github.com/casey/just):

* Run a single example with `just example [EXAMPLE NAME]` (e.g. `just example hello-world`).
* Iterate through all the examples with `just examples`.
  Ctrl-c to kill the current example and start the next one.
  Great for testing.
* See [`Justfile`](/Justfile) for details.

Or `cd` to a directory under [`examples/`](https://github.com/blaix/prettynice/tree/main/examples) and run:

```
npm install
npm run dev
```
