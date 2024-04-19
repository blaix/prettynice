# Javascript Tasks

Calling javascript in a way that fixes the problems with server-side ports.

## The Problem

Imagine you need to make a database request as part of an HTTP response.
How would you do that with ports?

```elm
GotRequest request response ->
    case request.path ->
        [ "articles", articleId ] ->
            command = getArticlePort articleId
            ...
```

but now how do you respond to _that_ request after the query port triggers a corresponding port with the result?
You could jump through hoops to save the response in the model and pass some identifier through both ports to tie them together.
No thanks!

For now, will encourage db-over-http and discourage server-side ports.
For v2, I will try to create a way to call javascript as a task. See below...

## Possible Solutions

### Custom "JS Task" Abstraction

Something like this:

```elm
GotRequest request response ->
    case request.path ->
        [ "articles", articleId ] ->
            { model = model
            , command = Gen.ServerTask.getArticle articleId
                |> Task.map (renderArticle response)
                |> Task.onError (renderArticleError response)
                |> Task.execute
            }
        ...
```

Not crazy about the name `ServerTask`.
Also not sure about using generated module vs something like `ServerTask "getArticle" ...`.

The idea is to use a single outgoing and a single incoming port managed by prettynice.
The `X-PN-Request-ID` header I'm adding should help for tying task chain to a single request.

For reference, look at:

* elm-pages' [`BackendTask.Custom.run`](https://package.elm-lang.org/packages/dillonkearns/elm-pages/latest/BackendTask-Custom#run)
  and [`BackendTask.Custom.Error`](https://package.elm-lang.org/packages/dillonkearns/elm-pages/latest/BackendTask-Custom#Error).
* elm-concurrent-task's [`ConcurrentTask.define`](https://package.elm-lang.org/packages/andrewMacmurray/elm-concurrent-task/latest/ConcurrentTask#define)

Some info about this from Dillon in discord:

> One of the challenges that I haven't come up with a great solution for is avoiding extra memory allocation and serialization as you andThen through the chain.

> What Andrew did in elm-concurrent-task (which was inspired by BackendTask is similar to what I had originally done. He has a Dict that stores all of the responses.

> What I eventually ended up doing to optimize the more common cases was to wait until all the promises at one level are resolved before letting the next andThen level execute. That means I don't need to store things in a Dict of responses, I can just pass them in. And there isn't as much trying to check things in the Dict to see if a response is there as each item comes back one-by-one.
> Pretty in-the-weeds, but that was a really tricky design problem that I never felt completely satisfied with. Having a language-level abstraction for that could definitely help there I think.
> I'm very pleased with the FatalError abstraction as well. It lets you get the best of both worlds with easily bailing out of something when things go really wrong, but also being very explicit about where things can fail with the types.

and later:

> I actually am also doing it through a regular old port. It's sort of a legacy setup where originally it was StaticHttp, so the only thing you could do was an HTTP request that got built in to the page's data. Then that evolved to have file reads, globs, then custom (running JS), and much more. But I stuck with that entrypoint of the HTTP request as the main place where the logic is for everything. Not something I would recommend modeling an implementation on, though, just the way things turned out over time as it evolved.
> But it's not acutally doing any hacks as far as the Elm part is concerned, just regular old ports. Plus lots of code generation and compiling different versions of an app (frontend version, backend version, codemoded versions, etc.). But as far as just executing the BackendTask, it's just ports.
> The core of it is really that you have to have a way to:

> * Send out a request as pure data (you can't send Elm functions through the port)
> * Send back response data when it is resolved
> * Identify the Elm callback code to run with the resolved data (i.e. running any andThen, map, etc.)
> * Get any followup requests
> * Rinse and repeat until you've resolved to a value

> It's surprisingly difficult to build.

### Ports as Tasks

Robin agrees ports should be tasks.
That would create an even better version of the above, but at the language level.

How hard would this be...?
