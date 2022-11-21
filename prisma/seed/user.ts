import { prisma } from "../seed";
import bcrypt from "bcrypt";

export const user = async () => {
  const salt = await bcrypt.genSalt();
  let password1 = await bcrypt.hash("Jalawiyata2!", salt);
  let password2 = await bcrypt.hash("Jalawiyata2!", salt);

  const user1 = await prisma.user.create({
    data: {
      username: "iamhkmid",
      email: "luqmanul612@gmail.com",
      firstName: "Muhammad Luqmanul",
      lastName: "Hakim",
      password: password1,
      role: "ADMIN",
      phone: "089633189921",
      isActive: true,
      pictureDir: "/uploads/profile/seed/",
      userPicture: "/uploads/profile/seed/img.jpg",
    },
  });
  const user2 = await prisma.user.create({
    data: {
      username: "naufal",
      firstName: "Naufal",
      lastName: "Fakhri",
      email: "naufal@gmail.com",
      password: password2,
      role: "USER",
      phone: "089633189922",
      isActive: true,
      Recipient: {
        create: [
          {
            firstName: "Naufal",
            lastName: "Fakhri",
            email: "naufal12345@gmail.com",
            phone: "0853687799132",
            City: {
              create: {
                id: "334",
                name: "Pangkal Pinang",
                postalCode: "33684",
                Province: {
                  create: {
                    id: "2",
                    name: "Bangka Belitung",
                  },
                },
              },
            },
            address:
              "Batin Tikal, Kec. Taman Sari, Kota Pangkal Pinang, Kepulauan Bangka Belitung 33684",
          },
          {
            firstName: "Muhammad Luqmanul",
            lastName: "Hakim",
            email: "luqman12345@gmail.com",
            phone: "089633189921",
            City: {
              create: {
                id: "227",
                name: "Lampung Utara",
                postalCode: "34516",
                Province: {
                  create: {
                    id: "18",
                    name: "Lampung",
                  },
                },
              },
            },
            address:
              "Jl.Madukoro Baru No.321 Kec. Kotabumi Utara, Kab. Lampung Utara, Prov. Lampung",
          },
        ],
      },
      pictureDir: "/uploads/profile/seed/",
      userPicture: "/uploads/profile/seed/img.jpg",
    },
  });

  console.log({
    user1,
    user2,
  });
};
