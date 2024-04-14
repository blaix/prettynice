const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.init = async function(app) {
  let users = await prisma.user.findMany();
  app.ports.users.send(users);
};


async function seed() {
    const users = [
      { id: 1, name: "Jane" },
      { id: 2, name: "Joe" },
      { id: 3, name: "Jerry" },
    ];

    for (user of users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: user,
        create: user,
      });
    };
}

seed();
