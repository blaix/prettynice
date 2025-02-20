# Changelog

## 3.0.0 (2025-02-20)

* Upgrade to gren 0.5 and associated packages
* New architecture for defining programs (See [#14](https://github.com/blaix/prettynice/issues/14)):
    * Remove `SimpleRouter`.
    * Move Program's request handling from `onRequest` msg in `update` to a dedicated `router` function.
    * Modify `defineProgram` to just need `init` and `router`.
    * Add `defineFullProgram` for full TEA.
    * Modify `router` to return a task that must resolve to a `Response`.
* Add `Response.onSend` so the router can trigger messages for `update` (See [#25](https://github.com/blaix/prettynice/issues/25))

## 2.0.1 (2024-09-26)

* Upgrade to gren 0.4 and associated packages
* `Prettynice.startProgram` accepts a `command` field, to match the API of `Node.startProgram`.
* Add `BytesBody` variant to `Response.Body`
* Fix filesystem errors when running on windows

## 1.0.2 (2024-03-10)

* Project generator available.
* Update install instructions.

## 1.0.1 (2024-03-09)

* Add install instructions

## 1.0.0 (2024-03-09)

* Initial release
