# Changelog

## 3.0.2 (2025-02-21)

* Restore custom routing to project generator (initial project isn't helpful enough without it)

## 3.0.1 (2025-02-20)

* Remove custom routing from project generator (no longer helpful since router logic is more complex now)

## 3.0.0 (2025-02-19)

* Update project generator for prettynice v3
* Fix bug in project generator that left an unhidden gitignore file in your project (See [#5](https://github.com/blaix/prettynice/issues/5))

## 2.0.3 (2025-01-03)

* Fix https://github.com/blaix/prettynice/issues/5
* Change default host to 0.0.0.0 in project template for easier deployment

## 2.0.2 (2024-10-10)

* Update generated project so nodemon watches public/ files too
* Fix project generator creating gitignore instead of .gitignore

## 2.0.0 (2024-09-26)

* Upgrade to prettynice v2

## 1.2.2 (2024-04-19)

* Update link in the error output when the cli fails to parse component props.
  It now links to the package docs instead of github source code.
  
## 1.2.1 (2024-03-17)

* Use `127.0.0.1` as the host in `init` project template (was `0.0.0.0`)

## 1.2.0 (2024-03-15)

* Exclude project template's build files from the published package
* Add `version` subcommand (also available as `-v` or `--version`)

## 1.1.4 (2024-03-14)

* Fixed missing .gitignore in project template

## 1.1.3 (2024-03-14)

* Add `init` to help/usage output
* Replace `/user/123` with `/hello/justin` in new project template. More
  straightforward and in line with example in the prettynice repo README.

## 1.1.2 (2024-03-10)

* Fix `init` when `node_modules` isn't in the current working directory.

## 1.1.1 (2024-03-09)

* `init` includes a client-side component in the generated project.

## 1.1.0 (2024-03-09)

* Fix for new projects that don't have gren on the PATH
* Add `init` subcommand to create new projects

## 1.0.0 (2024-03-09)

* Ready for prettynice gren package release

## 0.0.2 (2024-03-05)

* Add build [--optimize] subcommand

## 0.0.1 (2024-03-01)

* Initial release: build's prettynice app
