"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.author = void 0;
const seed_1 = require("../seed");
const author = async () => {
    const tereLiye = await seed_1.prisma.author.create({
        data: { name: "Tere Liye" },
    });
    const alviSyahrin = await seed_1.prisma.author.create({
        data: { name: "Alvi Syahrin" },
    });
    const anselWatra = await seed_1.prisma.author.create({
        data: { name: "Ansel Watra" },
    });
    const author1 = await seed_1.prisma.author.create({
        data: { name: "Example Author1" },
    });
    const author2 = await seed_1.prisma.author.create({
        data: { name: "Example Author2" },
    });
    const author3 = await seed_1.prisma.author.create({
        data: { name: "Example Author3" },
    });
    const author4 = await seed_1.prisma.author.create({
        data: { name: "Example Author4" },
    });
    const author5 = await seed_1.prisma.author.create({
        data: { name: "Example Author5" },
    });
    const author6 = await seed_1.prisma.author.create({
        data: { name: "Example Author6" },
    });
    const author7 = await seed_1.prisma.author.create({
        data: { name: "Example Author7" },
    });
    const author8 = await seed_1.prisma.author.create({
        data: { name: "Example Author8" },
    });
    const author9 = await seed_1.prisma.author.create({
        data: { name: "Example Author9" },
    });
    const author10 = await seed_1.prisma.author.create({
        data: { name: "Example Author10" },
    });
    const author11 = await seed_1.prisma.author.create({
        data: { name: "Example Author11" },
    });
    const author12 = await seed_1.prisma.author.create({
        data: { name: "Example Author12" },
    });
    const author13 = await seed_1.prisma.author.create({
        data: { name: "Example Author13" },
    });
    console.log({
        tereLiye,
        alviSyahrin,
        anselWatra,
        author1,
        author2,
        author3,
        author4,
        author5,
        author6,
        author7,
        author8,
        author9,
        author10,
        author11,
        author12,
        author13,
    });
    return {
        tereLiye,
        alviSyahrin,
        anselWatra,
        author1,
        author2,
        author3,
        author4,
        author5,
        author6,
        author7,
        author8,
        author9,
        author10,
        author11,
        author13,
    };
};
exports.author = author;
