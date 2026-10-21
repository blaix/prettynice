# Draft ticket: Multipart file-upload golden path

> Draft for discussion — candidate addition to the prettynice v4.0 milestone.
> Motivating app: the budget app (statement import). Not yet filed on GitHub.

## Motivation

Receiving an uploaded file is a near-universal web-app need and a hard blocker for the
budget app's **statement import** (upload an OFX/QFX file → parse it server-side →
reconcile). Nothing in the current milestone covers it: #58 handles the database, #53
handles server→client data (Props), but there's no story for **client→server file
bytes**.

Today a prettynice app has no blessed way to read a `multipart/form-data` upload:
`HttpServer.Request.body` is a fully-buffered `Bytes` and there's no multipart parser
anywhere in `gren-lang/node` or `gren-lang/core`.

## Design: mirror HttpClient's bytes-vs-stream duality

`HttpClient` already solves the "just give me the bytes" vs "hand me a stream" choice,
in both directions, and does the buffering in **kernel** code — so no core surface is
added:

* Outbound: `withBytesBody : String -> Bytes -> ...` vs
  `withStreamBody : String -> Stream.Readable Bytes -> ...`
* Inbound: `expectBytes : ... -> RequestConfiguration Bytes` vs
  `expectStream : ... -> RequestConfiguration (Stream.Readable Bytes)`, phantom-typed
  onto `send : ... -> Task Error (Response expectedBody)`.

The app picks how it wants the body; the framework buffers (kernel) or hands over the
live stream. We mirror this for uploads.

### No core additions required

The one thing I previously thought we'd need — a "drain a `Readable Bytes` into one
`Bytes`" helper in core — already exists as an idiom, demonstrated in the http-client
integration tests (`node/integration-tests/http-client/src/Tests.gren`):

```gren
.data
    >> Stream.readUntilClosed (\a -> Array.pushFirst a >> Ok) []  -- chunks -> Array Bytes
    >> Task.map Bytes.flatten                                     -- Array Bytes -> Bytes
```

`Bytes.flatten : Array Bytes -> Bytes` is already in core. So the buffered/happy path
needs **no new `Stream` or `Bytes` surface**; the collection lives at the framework
boundary exactly like `HttpClient.expectBytes`.

## The three pieces

1. **HttpServer streaming request body** *(upstream in `gren-lang/node`; already
   planned).* Today `onRequest` delivers `Request` with `body : Bytes` (buffered-only —
   see `TestsServer.gren`, which echoes `req.body`). Add a streaming sibling that
   delivers the body as `Stream.Readable Bytes`, shaped like `expectBytes`/`expectStream`
   (buffering stays kernel-side). API shape TBD (see open questions).
2. **A multipart/form-data parser** *(net-new, in prettynice — pure Gren, no Node
   dependency).* Buildable on the existing `Stream` primitives (`customTransformation`
   can express an incremental boundary parser); the buffered variant can parse an
   in-memory `Bytes` directly.
3. **prettynice `Upload` API** presenting the same duality per file part:

   ```gren
   -- "just give me the bytes" (framework buffers the part) — OFX / small-file happy path
   Upload.file       : String -> Request -> Task Error (Maybe UploadedFile)
   -- "hand me a stream" (framework hands the live part) — large files, gzip-to-storage, early reject
   Upload.fileStream : String -> Request -> Task Error (Maybe UploadedFileStream)

   -- UploadedFile       = { filename : String, contentType : String, bytes : Bytes }
   -- UploadedFileStream = { filename : String, contentType : String, stream : Stream.Readable Bytes }
   ```

   The budget app calls `Upload.file "statement"` → `Bytes` straight into `Ofx.parse` —
   no streams, no filesystem, no ceremony.

## Large files

* **Size cap** that aborts the stream past N bytes (mirror nginx `client_max_body_size`
  / multer `limits.fileSize`); check `Content-Length` first when present.
* **No forced disk I/O:** the stream variant lets the app pipe straight to gzip/storage,
  or `Stream.pipeTo (FileSystem.writeFileStream …)` to land a temp file *if it wants
  one* — the framework doesn't impose a temp-file lifecycle.
* **Consumption ordering:** the *streaming* variant inherits multipart's sequential
  nature (each part's stream must be consumed before the next). The *buffered* variant
  has no such constraint (the body is already in hand) — another reason the happy path
  stays simple.
* **Out of scope:** resumable uploads (tus) and direct-to-storage/presigned URLs. Note
  them as "if you need it," not v4 work — a self-hosted LAN app doesn't need them.

## Small-scope version that unblocks the budget app now

OFX/QFX files are KB–MB, so the budget app doesn't need streaming at all: a **buffered
multipart parse over today's `body : Bytes`** (piece 2's buffered variant + an
`Upload.file` that reads from the already-buffered body) unblocks statement import
*without* the HttpServer change. The streaming body (piece 1) + `Upload.fileStream` can
follow as the general-purpose large-file story.

## Open questions

* **HttpServer API shape** for the streaming body: two subscriptions
  (`onRequest` / `onRequestStream`), a body-type-parameterized `Request body`, or an
  `Expect`-style selector? Prefer whatever most resembles `HttpClient`'s `expect*`.
* **Where the multipart parser lives:** prettynice vs a shared `prettynice-common`
  (also floated in #53 for encode/decode helpers).
* **File field + typed forms:** ideally a file input is just another field in the
  form-decoding story (ticket 03) rather than a separate mechanism.

## Relation to milestone

* Complements **#58** (DB) — upload is the other half of "get data into the app."
* Pairs with **ticket 03** (typed form decoding) — a file field in a typed form.
* Depends on the HttpServer streaming-body change (mirror of `expectBytes`/`expectStream`).
* Good template example + browser-test material (#54/#55): upload a fixture, assert the
  parsed result.

## References (gren-lang/node)

* `src/HttpClient.gren` — `withBytesBody`/`withStreamBody`, `expectBytes`/`expectStream`.
* `integration-tests/http-client/src/Tests.gren` — streaming request/response bodies and
  the `readUntilClosed … |> Task.map Bytes.flatten` drain idiom.
* `integration-tests/http-client/src/TestsServer.gren` — confirms HttpServer is
  buffered-only today (`req.body : Bytes`).
