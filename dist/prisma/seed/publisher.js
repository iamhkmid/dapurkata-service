"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publisher = void 0;
const seed_1 = require("../seed");
const publisher = async () => {
    const alviArdhi = await seed_1.prisma.publisher.create({
        data: { name: "Alvi Ardhi Publishing" },
    });
    const gramedia = await seed_1.prisma.publisher.create({
        data: { name: "Gramedia Pustaka Utama" },
    });
    const gagasmedia = await seed_1.prisma.publisher.create({
        data: { name: "GAGASMEDIA" },
    });
    const andiPublisher = await seed_1.prisma.publisher.create({
        data: { name: "Andi Publisher" },
    });
    const dapurkata = await seed_1.prisma.publisher.create({
        data: { name: "Penerbit DapurKata" },
    });
    const publisher2 = await seed_1.prisma.publisher.create({
        data: { name: "Example publisher2" },
    });
    const publisher3 = await seed_1.prisma.publisher.create({
        data: { name: "Example publisher3" },
    });
    const publisher4 = await seed_1.prisma.publisher.create({
        data: { name: "Example publisher4" },
    });
    const publisher5 = await seed_1.prisma.publisher.create({
        data: { name: "Example publisher5" },
    });
    const publisher6 = await seed_1.prisma.publisher.create({
        data: { name: "Example publisher6" },
    });
    const publisher7 = await seed_1.prisma.publisher.create({
        data: { name: "Example publisher7" },
    });
    const publisher8 = await seed_1.prisma.publisher.create({
        data: { name: "Example publisher8" },
    });
    const publisher9 = await seed_1.prisma.publisher.create({
        data: { name: "Example publisher9" },
    });
    const publisher10 = await seed_1.prisma.publisher.create({
        data: { name: "Example publisher10" },
    });
    const publisher11 = await seed_1.prisma.publisher.create({
        data: { name: "Example publisher11" },
    });
    const publisher12 = await seed_1.prisma.publisher.create({
        data: { name: "Example publisher12" },
    });
    const publisher13 = await seed_1.prisma.publisher.create({
        data: { name: "Example publisher13" },
    });
    console.log({
        alviArdhi,
        gramedia,
        gagasmedia,
        andiPublisher,
        dapurkata,
        publisher2,
        publisher3,
        publisher4,
        publisher5,
        publisher6,
        publisher7,
        publisher8,
        publisher9,
        publisher10,
        publisher11,
        publisher12,
        publisher13,
    });
    return {
        alviArdhi,
        gramedia,
        gagasmedia,
        andiPublisher,
        dapurkata,
        publisher2,
        publisher3,
        publisher4,
        publisher5,
        publisher6,
        publisher7,
        publisher8,
        publisher9,
        publisher10,
        publisher11,
        publisher13,
    };
};
exports.publisher = publisher;
