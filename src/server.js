const main = require("./main.js");
const app = main.Gren.Main.init({});

try {
    const ports = require("./ports.js");
    if (ports.init) {
      ports.init(app);
    }
} catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
        throw e;
    }
}

