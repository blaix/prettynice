# Upgrading major versions

* [ ] bump gren package version
* [ ] check gren docs
* [ ] gren package validate
* [ ] tag new version

* [ ] `cp -r examples/next examples/v[n]`
* [ ] update gren.json in `examples/v[n]` to use published package and test
* [ ] update example code in [README.md](/README.md) and test
* [ ] update links to examples in [README.md](/README.md)

* [ ] `cp -r website/next website/v[n]`
* [ ] update links to examples in `website/v[n]`
* [ ] update links to website in `examples/v[n]`
* [ ] `cd website/v[n]` and `fly launch` with name `prettynice-v[n]`
* [ ] `flyctl deploy` and point `v[n].prettynice.dev` subdomain at `prettynice-v[n]`
* [ ] change `prettynice.dev` redirect to `v[n]` subdomain
* [ ] add banner to old version of website pointing to main domain for redirect to latest version

* [ ] import new version on package site
* [ ] blog post
* [ ] announce the release
