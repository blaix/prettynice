# Draft ticket: SQLite schema migrations (evolving a running DB)

> Draft for discussion — candidate addition to the prettynice v4.0 milestone.
> Motivating app: the budget app (an evolving `schema.sql`). Not yet filed on GitHub.

## Motivation

There are really **two different things** that both get called "migration", and the
framework currently only addresses the first:

1. **Standing up scaffolding for a new project** — creating the initial tables. This is
   what prettynice/#58 covers today, and `CREATE TABLE IF NOT EXISTS ... STRICT` run on
   startup (as in the registry's `Db.migrate`) handles it fine and idempotently.
2. **Changing an already-running production database** — applying `ALTER TABLE`, new
   tables, backfills, etc. exactly once, in order, to a DB that already holds real data.
   This is *not* covered, and the budget app will need it (the schema will evolve while
   holding real financial data I can't re-enter).

This ticket is about giving new projects a simple, blessed answer to #2 without turning
it into a heavyweight subsystem.

## Design preferences (from Justin)

Minimize dependencies; emphasize explicitness and simplicity. A small in-framework /
in-template solution that gets "most of the way there" beats a full-featured tool with
lots of bells and whistles. Standalone tools are acceptable if they're well-scoped, but
they're a trade-off against the minimize-deps preference.

## Options

### Option A — Ordered SQL files + a tiny runner (recommended starting point)

* A `migrations/` directory of plain `.sql` files named to sort in order, e.g.
  `001_initial.sql`, `002_add_default_deposit.sql`.
* A `schema_migrations` table tracking which filenames have been applied.
* A small runner (in the template, or a thin prettynice helper) that, on startup or via
  a task, applies pending files in order inside a transaction and records them.
* **Pros:** zero external dependencies; fully explicit (the SQL is right there and
  hand-written); trivial to read and reason about; ports the registry's existing style
  forward. **Cons:** no auto-generated diffs, no down-migrations (see below).

### Option B — In-framework migration API (Gren)

* A `Migrate` module: `Migrate.run db [ migration "001" sql, migration "002" sql, ... ]`
  that tracks an integer `user_version` (SQLite `PRAGMA user_version`) or a table, and
  applies only the un-applied ones in a transaction.
* Essentially Option A but expressed as Gren values instead of files. Same guarantees,
  no external dep, plays nicely with `gren-effectful-tests`.

### Option C — Integrate a standalone tool

* e.g. **dbmate** (single static binary, plain-SQL up/down migrations, DB-agnostic) or
  **goose**/**Atlas**. The template would shell out to it.
* **Pros:** battle-tested, handles ordering/state for you, supports down-migrations.
  **Cons:** adds a non-Node binary dependency — cuts against the minimize-deps
  preference; another install step for `prettynice init` users on every platform (ties
  into #61 cross-platform concerns).

## Recommendation

Start with **Option A or B** (they're the same idea; pick files-on-disk vs Gren-values
by taste) as the golden path, and simply *document* Option C for anyone who wants
down-migrations / diffing later. That satisfies "most of the way there without all the
bells and whistles" and keeps dependencies at zero.

## SQLite-specific notes / open questions

* **Down-migrations:** probably skip for v1. In practice forward-only + a good backup is
  simpler and safer; add reversibility only if a real need appears.
* **`ALTER TABLE` limits:** SQLite supports add-column, rename-column/table, and
  drop-column (recent versions), but more complex changes need the 12-step
  "create new table, copy, drop, rename" dance. The golden path should show that pattern
  once so people aren't surprised.
* **When to run:** on app startup (simple, but couples deploy to app boot) vs. an
  explicit `migrate` task/subcommand (see ticket 05) run before starting the new
  version. The explicit task is safer for production; startup is fine for dev.
* **Backups first:** whatever we pick, the template should pair migrations with a
  "back up the DB file before applying" note (a plain `sqlite3 .backup` — see ticket 04
  for keeping this un-nix-coupled).
