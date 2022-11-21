import { prisma } from "../seed";

export const courier = async () => {
  const courier1 = await prisma.courier.create({
    data: {
      code: "jne",
      name: "Jalur Nugraha Ekakurir (JNE)",
      isEnabled: true,
    },
  });
  const courier2 = await prisma.courier.create({
    data: { code: "pos", name: "POS Indonesia (POS)", isEnabled: true },
  });
  const courier3 = await prisma.courier.create({
    data: {
      code: "tiki",
      name: "Citra Van Titipan Kilat (TIKI)",
      isEnabled: true,
    },
  });

  console.log(courier1, courier2, courier3);
};
