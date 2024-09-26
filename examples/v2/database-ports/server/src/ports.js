const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.init = async function(app) {
    app.ports.getUser.subscribe(async function({ requestId, userId }) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });
            app.ports.gotUser.send({ requestId, user });
        } catch (e) {
            // Always send a result to avoid dangling requests.
            // In reality you'll want to represent errors somehow.
            app.ports.gotUser.send({ requestId, user: null });
        }
    });
};
