# Pretty Nice Website

Built with [Starlight](https://starlight.astro.build).

```
npm install
npm run dev
```

Starlight looks for `.md` or `.mdx` files in the `src/content/docs/` directory. Each file is exposed as a route based on its file name.

See `astro.config.mjs` for site and sidebar/navigation configuration.

Images can be added to `src/assets/` and embedded in Markdown with a relative link.

Static assets, like favicons, can be placed in the `public/` directory.

## 🚀 Deploy

Deployed via fly.io

```
flyctl deploy
```
