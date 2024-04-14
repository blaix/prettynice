const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.init = async function(app) {
  let users = await prisma.user.findMany();
  app.ports.users.send(users);
};
