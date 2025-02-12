# Using Tailwind/DaisyUI with Prettynice

This is an example of using [TailwindCSS](https://tailwindcss.com/) and [DaisyUI](https://daisyui.com/) with Prettynice.
The process should be similar for other UI frameworks.

It was set up with these steps:

1. Create a prettynice project. In an empty directory: `npx prettynice init`
2. Install tailwind, the tailwind cli, and diasyui (beta is required for tailwind 4): `npm install tailwindcss @tailwindcss/cli daisyui@beta`
4. Create a source css file that imports tailwind and the daisyui plugin. See this project's [`assets/styles.css`](assets/styles.css) for an example.
5. Update `package.json` to add tailwind to the build step. See this project's [`package.json`](package.json) for an example. Note: It's important that the prettynice build needs comes before the tailwind build.
6. Use the daisy and tailwind class names normally (with [`Attribute.class`](https://packages.gren-lang.org/package/icidasset/html-gren/version/latest/module/Transmutable.Html.Attributes#class)). See [`server/src/Main.gren`](server/src/Main.gren) for an example.

Run with:

```
npm install
npm run dev
```
