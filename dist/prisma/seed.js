"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const book_1 = require("./seed/book");
const courier_1 = require("./seed/courier");
const footerInfo_1 = require("./seed/footerInfo");
const paymentType_1 = require("./seed/paymentType");
const user_1 = require("./seed/user");
exports.prisma = new client_1.PrismaClient();
async function main() {
    await (0, book_1.book)();
    await (0, user_1.user)();
    await (0, paymentType_1.paymentType)();
    await (0, courier_1.courier)();
    await (0, footerInfo_1.footerInfo)();
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await exports.prisma.$disconnect();
});
