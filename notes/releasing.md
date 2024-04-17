# Upgrading major versions

* [ ] `cp -r examples/next examples/v[n]`
* [ ] update links to examples in [README.md](/README.md)
* [ ] `cp -r website/next website/v[n]`
* [ ] update links to examples in `website/v[n]`
* [ ] update links to website in `examples/v[n]`
* [ ] `cd website/v[n]` and `fly launch` with name `prettynice-v[n]`
* [ ] `flyctl deploy` and point `v[n].prettynice.dev` subdomain at `prettynice-v[n]`
* [ ] change `prettynice.dev` redirect to `v[n]` subdomain
* [ ] blog post
* [ ] announce the release
