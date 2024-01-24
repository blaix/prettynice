# Pretty Nice Framework

A purely functional, fully type-safe, full-stack web framework for [Gren](https://gren-lang.org/).

## In early proof of concept stage!

**See [`examples/`](examples/) for working examples of the current functionality.**

Things are still very foundational.
Currently working on the API and what level of control the framework should have over your app.

Right now it's a thin wrapper over a [Node.Program](https://packages.gren-lang.org/package/gren-lang/node/version/3.0.1/module/Node#Program) that adds the following features:

* Manages server lifecycle. Your program only needs to handle the request message.
* Client-side components (wrappers around a Browser.element) can be dropped into server-side HTML, with flags passed in from the server that are type-checked at compile time and automatically encoded.
* Automatically wire up a server-side ports.js file.
* Wrappers around node's Request and Response to make it easier to route requests and send responses.

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
