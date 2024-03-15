#!/usr/bin/env node

const pkg = require ("../package.json");
const main = require("./main.js");
const app = main.Gren.Main.init({});

app.ports.gotDirname.send(__dirname);
app.ports.getVersion.subscribe(() => {
    app.ports.gotVersion.send(pkg.version);
});
