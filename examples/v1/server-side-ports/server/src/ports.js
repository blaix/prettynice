const crypto = require("crypto");

exports.init = async function(app) {
    app.ports.getUuid.subscribe(function() {
        app.ports.receiveUuid.send(
            crypto.randomUUID()
        );
    });
};

