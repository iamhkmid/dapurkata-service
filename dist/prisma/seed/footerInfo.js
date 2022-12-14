"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.footerInfo = void 0;
const seed_1 = require("../seed");
const footerInfo = async () => {
    const phone = await seed_1.prisma.footerInfo.create({
        data: {
            type: "phone",
            isEnabled: true,
            value: "081273272469",
        },
    });
    const address = await seed_1.prisma.footerInfo.create({
        data: {
            type: "address",
            isEnabled: true,
            value: "Jln. Dahlia Dalam 1 No. 446 RT/RW 003/001, kel. Bukit Merapin, kec. Gerunggang Pangkalpinang Kepulauan Bangka Belitung 33123 Indonesia",
        },
    });
    const message = await seed_1.prisma.footerInfo.create({
        data: {
            type: "message",
            isEnabled: true,
            value: "Penerbit DapurKata © 2021 ~ Made with ❤️",
        },
    });
    const socialMedia1 = await seed_1.prisma.footerInfo.create({
        data: {
            type: "social_media",
            value: JSON.stringify({
                name: "Facebook",
                url: "https://www.facebook.com/dapur.kata.77",
            }),
            isEnabled: true,
        },
    });
    const socialMedia2 = await seed_1.prisma.footerInfo.create({
        data: {
            type: "social_media",
            value: JSON.stringify({
                name: "Instagram",
                url: "https://www.instagram.com/dapurkata.id/",
            }),
            isEnabled: true,
        },
    });
    const socialMedia3 = await seed_1.prisma.footerInfo.create({
        data: {
            type: "social_media",
            value: JSON.stringify({
                name: "Twitter",
                url: "https://twitter.com/DapurKatadotid",
            }),
            isEnabled: true,
        },
    });
    const socialMedia4 = await seed_1.prisma.footerInfo.create({
        data: {
            type: "social_media",
            value: JSON.stringify({
                name: "Gmail",
                url: "mailto:dapurkata.id@gmail.com?subject",
            }),
            isEnabled: true,
        },
    });
    const socialMedia5 = await seed_1.prisma.footerInfo.create({
        data: {
            type: "social_media",
            value: JSON.stringify({
                name: "Whatsapp",
                url: "https://wa.link/lc00fi",
            }),
            isEnabled: true,
        },
    });
    console.log(phone, address, message, socialMedia1, socialMedia2, socialMedia3, socialMedia4, socialMedia5);
};
exports.footerInfo = footerInfo;
