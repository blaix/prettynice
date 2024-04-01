# Prettynice Website

This is the root instance of the versioned doc site. It will redirect to the current version subdomain. See [`Caddyfile`](./Caddyfile).

Each website is its own fly.io application. See the `fly.toml` config in this directory and all the `v*` subdirectories.

It's set up this way so that URLs won't rot.
