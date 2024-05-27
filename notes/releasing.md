# Upgrading any version

* [ ] Search repo for `prettynice/version` to update links to package docs (e.g. link to `FieldType` for support Prop types).

# Upgrading major versions

* [ ] bump and publish gren package version
* [ ] `cp -r examples/next examples/v[n]`
* [ ] update gren.json in `examples/v[n]` to use published package
* [ ] update example code in [README.md](/README.md)
* [ ] update links to examples in [README.md](/README.md)
* [ ] `cp -r website/next website/v[n]`
* [ ] update links to examples in `website/v[n]`
* [ ] update links to website in `examples/v[n]`
* [ ] `cd website/v[n]` and `fly launch` with name `prettynice-v[n]`
* [ ] `flyctl deploy` and point `v[n].prettynice.dev` subdomain at `prettynice-v[n]`
* [ ] change `prettynice.dev` redirect to `v[n]` subdomain
* [ ] blog post
* [ ] announce the release
