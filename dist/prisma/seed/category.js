"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.category = void 0;
const seed_1 = require("../seed");
const category = async () => {
    const cat1 = await seed_1.prisma.category.create({
        data: { group: "ReaderGroup", name: "Anak" },
    });
    const cat2 = await seed_1.prisma.category.create({
        data: { group: "ReaderGroup", name: "Dewasa" },
    });
    const cat3 = await seed_1.prisma.category.create({
        data: { group: "ReaderGroup", name: "Semua Umur" },
    });
    const cat4 = await seed_1.prisma.category.create({
        data: { group: "LibraryType", name: "Fiksi" },
    });
    const cat5 = await seed_1.prisma.category.create({
        data: { group: "LibraryType", name: "Non Fiksi" },
    });
    const cat6 = await seed_1.prisma.category.create({
        data: { group: "Other", name: "Example Category9" },
    });
    const cat7 = await seed_1.prisma.category.create({
        data: { group: "Other", name: "Example Category10" },
    });
    const cat8 = await seed_1.prisma.category.create({
        data: { group: "Other", name: "Example Category1" },
    });
    const cat9 = await seed_1.prisma.category.create({
        data: { group: "Other", name: "Example Category2" },
    });
    const cat10 = await seed_1.prisma.category.create({
        data: { group: "Other", name: "Example Category3" },
    });
    const cat11 = await seed_1.prisma.category.create({
        data: { group: "Other", name: "Example Category4" },
    });
    const cat12 = await seed_1.prisma.category.create({
        data: { group: "Other", name: "Example Category5" },
    });
    const cat13 = await seed_1.prisma.category.create({
        data: { group: "Other", name: "Example Category6" },
    });
    const cat14 = await seed_1.prisma.category.create({
        data: { group: "Other", name: "Example Category7" },
    });
    const cat15 = await seed_1.prisma.category.create({
        data: { group: "Other", name: "Example Category8" },
    });
    console.log({
        cat1,
        cat2,
        cat3,
        cat4,
        cat5,
        cat6,
        cat7,
        cat8,
        cat9,
        cat10,
        cat11,
        cat12,
        cat13,
        cat14,
        cat15,
    });
    return {
        cat1,
        cat2,
        cat3,
        cat4,
        cat5,
        cat6,
        cat7,
        cat8,
        cat9,
        cat10,
        cat11,
        cat12,
        cat13,
        cat14,
        cat15,
    };
};
exports.category = category;
