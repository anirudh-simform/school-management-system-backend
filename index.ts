import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.newUser.create({
        data: {
            name: "John",
        },
    });

    console.log(user);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
    });
