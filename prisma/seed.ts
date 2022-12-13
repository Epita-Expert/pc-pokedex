import { PrismaClient, Sex, Role } from "@prisma/client";
import console from "console";
const prisma = new PrismaClient();

async function main() {
  await prisma.trainers.upsert({
    where: { login: "ashketchum" },
    update: {},
    create: {
      name: "Ash Ketchum",
      birth: new Date("10-08-1999"),
      login: "ashketchum",
      password: "pikachu",
      roles: [Role.USER],
    },
  });

  await prisma.trainers.upsert({
    where: { login: "leopkmn" },
    update: {},
    create: {
      name: "Leo Pokemaniac",
      birth: new Date("08-10-1999"),
      login: "leopkmn",
      password: "cynthia",
      roles: [Role.USER],
    },
  });

  await prisma.pokemons.upsert({
    where: { id: 25 },
    update: {},
    create: {
      name: "Pikachu",
      type: "ELECTRIC",
      species: "Mouse",
      level: 100,
      weight: 6,
      height: 0.4,
      chromatic: false,
      sex: Sex.MALE,
      trainer: {
        connect: {
          login: "ashketchum",
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
