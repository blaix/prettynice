#!/usr/bin/env node

const main = require("./main.js");
const app = main.Gren.Main.init({});
app.ports.getDirname.send(__dirname);
