#!/usr/bin/env node

const pkg = require ("../package.json");
const main = require("./main.js");
const app = main.Gren.CLI.init({});

/* I don't think I need this anymore since I'm using env.applicationPath?
app.ports.gotDirname.send(__dirname);
app.ports.getVersion.subscribe(() => {
    app.ports.gotVersion.send(pkg.version);
});
*/
