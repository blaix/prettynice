# Draft ticket: Typed form decoding + validation/error rendering

> Draft for discussion — candidate addition to the prettynice v4.0 milestone.
> Motivating app: the budget app (very form-heavy). Not yet filed on GitHub.

## Motivation

The budget app is mostly forms: account CRUD, envelope CRUD, manual account/envelope
adjustments, and the **Allocate Funds** form (a field per envelope). Every one of them
needs the same inbound-direction machinery on POST:

1. decode a submitted form's raw string fields into a typed domain value,
2. accumulate per-field validation errors,
3. re-render the form with those errors and the user's entered values preserved.

#53 improves **Props** (server→client data). This ticket is the other direction:
**form → typed value**, which prettynice doesn't have a blessed story for yet. Without
it, every form handler hand-rolls string parsing and error plumbing.

## Elm ecosystem to borrow from

I surveyed the Elm form libraries; three patterns are worth stealing, and they suit
prettynice's server-rendered + progressive-enhancement model well:

* **dillonkearns/elm-form** — the closest fit. Built around standard HTML `<form>`
  submission and progressive enhancement (the same instinct as prettynice). A `Form` is
  defined with `Form.form` + `Field.*` combinators; validation/parsing uses an
  applicative pipeline (`Validation.succeed |> Validation.andMap`) that **parses fields
  into a combined typed value in the same pass** as it collects errors. Crucially, the
  *same* form definition can validate on the client and be re-run on the server — which
  maps directly onto prettynice rendering a form and then decoding its POST.
  <https://github.com/dillonkearns/elm-form>
* **hecrj/composable-form** — a `Form` is a decoupled *definition* (independent of
  values, view state, and rendering); each field is a "mini-form" that composes. Great
  ergonomics for building a form declaratively without a Msg/field. Good source of API
  taste for composition. <https://github.com/hecrj/composable-form>
* **arowM/elm-form-decoder** — the minimalist take: a `Decoder` from raw input to a
  typed value that accumulates errors, deliberately decoupled from view. This is the
  smallest possible version of exactly what prettynice needs on the server.

## What to borrow (suggested direction)

Lean on the **dillonkearns/elm-form applicative-parse pattern** as the core, because it
unifies "render the form" and "decode + validate the submission" in one definition —
which is precisely the full-stack seam prettynice sits on:

* One `Form` definition per form, usable to **render** fields (with values + errors) and
  to **decode** a submitted request into `Ok typedValue` or `Err fieldErrors`.
* Applicative combination (`succeed`/`andMap`-style) so decoding a form of N fields
  yields one typed record and a `Dict field -> errors`.
* Field-level validators that compose (required, int/decimal, min/max, custom), plus
  cross-field validation (e.g. Allocate: the sum can't exceed Unallocated).
* Re-render on error preserves entered raw values + shows messages inline.

Borrow **composable-form's** "field is a mini-form" composition idea for ergonomics, and
keep **form-decoder's** "just decode to a typed value, decoupled from view" as the
fallback mental model if the full thing is too big for v4.

## Open questions

* Scope for v4: full render+decode `Form` abstraction, or start with just the
  **server-side decoder** (raw form → typed value + errors) and leave rich client-side
  rendering for later? The decoder alone would already remove most budget-app
  boilerplate.
* How does this compose with **Props** (#53) and with the **file-upload** work
  (ticket 01)? Ideally a file input is just another field type in the same form.
* Encoding/decoding helpers home: `prettynice-common` (also raised in #53)?

## Relation to milestone

* Natural companion to **#57** (CRUD scaffolding) — generated forms would use this.
* Directional overlap with **#53** (Props / code gen / prettynice-common).
* Exercised heavily by the budget app's forms; good browser-test material (#54/#55).

## Sources

* dillonkearns/elm-form — <https://github.com/dillonkearns/elm-form>
* dillonkearns/elm-form intro — <https://discourse.elm-lang.org/t/introducing-dillonkearns-elm-form-a-new-approach-to-forms-in-elm/9085>
* hecrj/composable-form — <https://github.com/hecrj/composable-form>
