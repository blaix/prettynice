# Nested TEA Example

This is an example of [nested TEA](https://sporto.github.io/elm-patterns/architecture/nested-tea.html) in prettynice.

[`server/src/Main.gren`](server/src/Main.gren) routes requests to
[`server/src/Handlers/RandomNumber.gren`] which has its own init/update cycle.

This is a little cumbersome and has extra boilerplate.
Prettynice may provide ways to help with this in the future.
Suggestions welcome!

```
npm install
npm run dev
```
