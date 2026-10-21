# Draft ticket: Deployment story for prettynice apps (backend-agnostic)

> Draft for discussion — candidate addition to the prettynice v4.0 milestone.
> Motivating app: the budget app (self-hosted on shire). Not yet filed on GitHub.

## Motivation

#52 covers project *init* options, but nothing produces a **deployment** scaffold. Every
one of Justin's apps (growth, mynotes, myrecords, …) currently hand-rolls its own
hosting setup. A prettynice app should have a blessed, documented path from "it runs
locally" to "it's serving on a box."

The budget app needs exactly this to land on shire.

## Hard constraint (from Justin)

**Do not couple to Nix.** Nix should be *one option among several*, not assumed. Give
options so a non-nix Linux / Mac / container user is equally served.

## Design leverage: the build artifact is just Node

A built prettynice app is a Node program plus static assets — the only runtime
dependency is Node. That means deployment can be almost entirely unopinionated, and we
just provide **optional recipes** for common targets rather than a single blessed stack.

## Options (offer a choice, e.g. at `prettynice init` or as docs/templates)

* **Plain process (baseline, no extra deps).** `prettynice build` → run `node app` under
  whatever supervises processes on the host. Document a generic systemd unit and a
  "just run it behind (or without) any reverse proxy" note. Works on any Linux/Mac.
* **Container (`Dockerfile`).** A template Dockerfile producing a self-contained image;
  portable to any container host. Good default for people who don't want to think about
  the host.
* **systemd unit template.** A `.service` file (no Nix) for the common
  self-hosted-Linux case, parameterized by port and data dir.
* **Nix flake + NixOS module.** For nix users (like shire): a flake exposing a
  `nixosModules.<app>` in the blaixapps style (systemd service + optional backup timer).
  Generated **only if chosen**, never assumed.

The interactive init (see #52's TUI idea) could ask "deployment target? none /
Dockerfile / systemd / nix" and drop in the matching files.

## Cross-cutting concerns (keep these backend-neutral)

* **Data dir + port** as plain config/env (`BUDGET_DB_PATH`-style), so every target
  wires them the same way.
* **DB backups** as a plain, dependency-free script (`sqlite3 .backup` on a schedule) —
  documented independently of Nix so the systemd/Docker/plain paths can all use it. (Ties
  to ticket 02.)
* **Migrations** run as an explicit step before starting the new version, or on boot —
  same story regardless of target (ticket 02 / ticket 05).
* **No reverse proxy required** by default; document putting one in front (Caddy/nginx)
  as optional, since LAN/WireGuard-only apps like the budget app don't need TLS.

## Open questions

* Which targets ship in v4 vs. later? Suggest: **plain process + Dockerfile** as the two
  first-class documented paths, with systemd and nix as additional generated options.
* Do we generate these at `init` time (chosen once) or ship a `deploy/` examples dir the
  user copies from? Examples dir is lower-commitment and easy to keep backend-agnostic.

## Relation to milestone

* Extends **#52** (init/CLI) with a deployment dimension.
* Interacts with **#61** (cross-platform) — deployment recipes should be validated on
  the same platform matrix.
