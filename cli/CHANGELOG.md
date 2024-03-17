# Changelog

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
