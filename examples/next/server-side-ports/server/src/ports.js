const crypto = require("crypto");

exports.init = async function(app) {
    app.ports.getUuid.subscribe(function(requestId) {
        app.ports.gotUuid.send({
            requestId: requestId,
            uuid: crypto.randomUUID(),
        });
    });
};

