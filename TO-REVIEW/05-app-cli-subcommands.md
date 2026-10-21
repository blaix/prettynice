# Draft ticket: App-defined CLI subcommands / one-off server tasks

> Draft for discussion — candidate addition to the prettynice v4.0 milestone.
> Motivating app: the budget app (import + maintenance tasks). Not yet filed on GitHub.
> Lowest priority of the five drafts.

## Motivation

Beyond serving HTTP, an app often needs to run **one-off tasks** with access to the same
code and database: run a migration, back up the DB, or in the budget app's case do a
**headless statement import** (`budget import july.ofx`) or a maintenance/backfill.

#52 moves the *framework* CLI into the main project. This ticket is the adjacent
question: how does an **app** expose its own commands/tasks, reusing its models, DB
access, and server-side tasks — without standing up a separate ad-hoc entrypoint each
time?

## Options

* **Framework-provided CLI module.** A `Prettynice.Cli` (or similar) that lets an app
  register subcommands mapping a name + args to a `Task`, sharing the app's DB/config
  setup. `myapp <subcommand> [args]` dispatches to it. Most ergonomic; new surface area
  to design (arg parsing, help text — could reuse the same TUI/arg ideas as #52).
* **Documented pattern, no new API.** Just show how to add a second Gren `Node` program
  in the project (its own `main`) that imports the shared modules and runs a `Task`.
  This mirrors the **#59 test harness** decision (each test module has its own `main`,
  run via `gren run`). Zero framework surface; slightly more boilerplate per command.
* **Hybrid.** Ship the documented pattern now; graduate to a small `Prettynice.Cli`
  helper if it proves common.

## Recommendation

Given the minimize-deps / simplicity preference and that #59 already establishes the
"module with its own `main`, run via `gren run`" convention, **start with the documented
pattern** (Option B) and only add a helper later if warranted. The budget app's
`import` and `backup` commands would validate whether a real abstraction is worth it.

## Open questions

* Overlap with migrations (ticket 02) and deployment (ticket 04): the `migrate` and
  `backup` steps are exactly this kind of task — worth a shared example.
* Does reusing server-side task setup (DB permissions, config) need anything from #49
  (explicit permissions / `startProgram`)? A CLI task wants the same subsystem access as
  the server, granted explicitly.

## Relation to milestone

* Extends **#52** (CLI in main project) from framework-CLI to app-CLI.
* Shares the "own `main` per entrypoint" convention with **#59** (test harness).
* Provides the execution vehicle for **#02 draft** (migrate task) and **#04 draft**
  (backup task).
