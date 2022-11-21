import { prisma } from "../seed";

export const publisher = async () => {
  const alviArdhi = await prisma.publisher.create({
    data: { name: "Alvi Ardhi Publishing" },
  });
  const gramedia = await prisma.publisher.create({
    data: { name: "Gramedia Pustaka Utama" },
  });
  const gagasmedia = await prisma.publisher.create({
    data: { name: "GAGASMEDIA" },
  });
  const andiPublisher = await prisma.publisher.create({
    data: { name: "Andi Publisher" },
  });
  const dapurkata = await prisma.publisher.create({
    data: { name: "Penerbit DapurKata" },
  });
  const publisher2 = await prisma.publisher.create({
    data: { name: "Example publisher2" },
  });
  const publisher3 = await prisma.publisher.create({
    data: { name: "Example publisher3" },
  });
  const publisher4 = await prisma.publisher.create({
    data: { name: "Example publisher4" },
  });
  const publisher5 = await prisma.publisher.create({
    data: { name: "Example publisher5" },
  });
  const publisher6 = await prisma.publisher.create({
    data: { name: "Example publisher6" },
  });
  const publisher7 = await prisma.publisher.create({
    data: { name: "Example publisher7" },
  });
  const publisher8 = await prisma.publisher.create({
    data: { name: "Example publisher8" },
  });
  const publisher9 = await prisma.publisher.create({
    data: { name: "Example publisher9" },
  });
  const publisher10 = await prisma.publisher.create({
    data: { name: "Example publisher10" },
  });
  const publisher11 = await prisma.publisher.create({
    data: { name: "Example publisher11" },
  });
  const publisher12 = await prisma.publisher.create({
    data: { name: "Example publisher12" },
  });
  const publisher13 = await prisma.publisher.create({
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
