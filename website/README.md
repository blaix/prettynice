# Prettynice Website

Each major version of the framework has its own `v*` subdirectory, which is its own fly.io app with its own `v*.prettynice.dev` subdomain.
The root domain will redirect to the latest major version, via dnsimple.

It's set up this way to avoid URL rot.

## Adding new version of website

- [ ] Update website/next to latest version
- [ ] `cp -r website/next website/v[n] && cd website/v[n]`
- [ ] test `npm run dev` and `npm run build`
- [ ] `flyctl launch` and test site on fly
- [ ] add CNAME for `v[n].prettynice.dev` in dnsimple
- [ ] `fly certs add v[n].prettynice.dev` and test subdomain
- [ ] change `prettynice.dev` URL records in dnsimple to redirect to `v[n]`
- [ ] update `website/v[n-1]` with a banner pointing to top-level domain
