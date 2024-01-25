# TODO

- [X] Kill exploration history and move to github
- [X] Add example with FE components
- [X] Mount handlers as full tea modules? Manual example only for now.
- [X] Update main project README
- [ ] === Get feedback on the API ===
- [ ] Change examples to use local package path for prettynice instead of src in gren.json
- [ ] Document how to use framework before a package is released
- [ ] Document how to actually compile and run the server
- [ ] Update gren guide? Understanding the framework requires an understanding of Gren, but that still requires an understanding of elm.
- [ ] Built-in handlers for common use-cases? At least a NotFound handler.
- [ ] Try a FE component that communicates with the server with Msg/update
- [ ] Add an optional ports.js for the client-side?
- [ ] Remove unused code
- [ ] helpful error message when compile fails from unsupported loader type
- [ ] Replace build.sh with prettynice cli commands (see joeybright/gren-args)
- [ ] e2e tests (Gren package that uses [playwright lib](https://playwright.dev/docs/library) through ports?)
- [ ] Components with custom js and ports (consider Mario's elm-pkg-js proposal)
- [ ] start migrating pencils
- [ ] Support more loader types in codegen
- [ ] Model an example page that submits a form to the server like sveltekit: https://kit.svelte.dev/docs/form-actions
- [ ] Unit Tests
- [ ] Handle TODO comments in code
- [ ] Speed up build step. Parallelize build tasks? (codegen has to happen before client/server builds)
- [ ] Docs & gren-doc-preview:
  - [ ] API
  - [ ] Adding handlers
  - [ ] Using components
  - [ ] Forms
  - [ ] Deployment
- [ ] Review README
- [ ] Decide on a license
- [ ] Gren packages decoupled from github? https://gren.zulipchat.com/#narrow/stream/376306-ideas/topic/Decoupling.20packages.20from.20github/near/411042679
- [ ] === release 0.1 ===
- [ ] doc site
- [ ] blaix.com post
- [ ] cli command to codegen new handlers
- [ ] response types that depend on request types (e.g. 404 that returns html, string, or json)
- [ ] Runtime client/server communication. Look into HTMX, SSE, and ports.
- [ ] === release 0.2? ===
- [ ] After gren-in-gren: Improve component codegen
- [ ] Improved form API?
- [ ] SSR + hydration for components?
- [ ] Database interaction ideas:
  - [ ] Use gren Process API:
      ```
      $ sqlite3 db.sqlite "select * from cats" # or psql?
      1|scampers|100
      2|gameboy|1
      3|kylo|5
      ```
  - [ ] or use ports to map records and queries to prisma?
    - This gives web view and migrations for "free"
      (but maybe gren api for these would be better)

## Open questions and future ideas

- [ ] Package with bun? https://codeberg.org/blaix/public-wiki/wiki/Gren-snippets#compile-standalone-executable
- [ ] Postmark for email? https://postmarkapp.com/ (Mario from Lamdera recommends)
- [ ] Consider devbox: https://www.jetpack.io/devbox/:
    - Running services: https://www.jetpack.io/devbox/docs/guides/services/
    - Generating a dockerfile: https://www.jetpack.io/devbox/docs/cli_reference/devbox_generate_dockerfile/
- [ ] Prometheus for server metrics with Caddy? https://caddyserver.com/docs/metrics
- [ ] Look at https://charm.sh/ for nicer cli interface. Especially glow.
