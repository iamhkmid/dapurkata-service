"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courier = void 0;
const seed_1 = require("../seed");
const courier = async () => {
    const courier1 = await seed_1.prisma.courier.create({
        data: {
            code: "jne",
            name: "Jalur Nugraha Ekakurir (JNE)",
            isEnabled: true,
        },
    });
    const courier2 = await seed_1.prisma.courier.create({
        data: { code: "pos", name: "POS Indonesia (POS)", isEnabled: true },
    });
    const courier3 = await seed_1.prisma.courier.create({
        data: {
            code: "tiki",
            name: "Citra Van Titipan Kilat (TIKI)",
            isEnabled: true,
        },
    });
    console.log(courier1, courier2, courier3);
};
exports.courier = courier;
