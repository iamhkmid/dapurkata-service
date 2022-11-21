import { PrismaClient } from "@prisma/client";
import { book } from "./seed/book";
import { courier } from "./seed/courier";
import { footerInfo } from "./seed/footerInfo";
import { paymentType } from "./seed/paymentType";
import { user } from "./seed/user";
export const prisma = new PrismaClient();
async function main() {
  await book();
  await user();
  await paymentType();
  await courier();
  await footerInfo();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
