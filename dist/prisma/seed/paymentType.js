"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentType = void 0;
const seed_1 = require("../seed");
const howToPay_1 = require("./howToPay");
const paymentType = async () => {
    const bankTransfer = await seed_1.prisma.paymentType.create({
        data: {
            id: "BANK_TRANSFER",
            name: "ATM/Bank Transfer",
            description: "Bayar dari ATM atau Internet Banking",
            isEnabled: true,
        },
    });
    const bt1 = await seed_1.prisma.paymentService.create({
        data: {
            id: "BCA_BANK_TRANSFER",
            name: "BCA",
            isEnabled: true,
            howToPay: howToPay_1.htp_bca_bank_transfer,
            description: "Bayar dari ATM BCA atau Internet Banking",
            PaymentType: { connect: { id: bankTransfer.id } },
            icon: "/img/payments/bank_transfer/bca.svg",
        },
    });
    const bt2 = await seed_1.prisma.paymentService.create({
        data: {
            id: "BNI_BANK_TRANSFER",
            name: "BNI",
            isEnabled: true,
            howToPay: howToPay_1.htp_bni_bank_transfer,
            description: "Bayar dari ATM BNI atau Internet Banking",
            PaymentType: { connect: { id: bankTransfer.id } },
            icon: "/img/payments/bank_transfer/bni.svg",
        },
    });
    const bt3 = await seed_1.prisma.paymentService.create({
        data: {
            id: "BRI_BANK_TRANSFER",
            name: "BRI",
            isEnabled: true,
            howToPay: howToPay_1.htp_bri_bank_transfer,
            description: "Bayar dari ATM BRI atau Internet Banking",
            PaymentType: { connect: { id: bankTransfer.id } },
            icon: "/img/payments/bank_transfer/bri.svg",
        },
    });
    const bt4 = await seed_1.prisma.paymentService.create({
        data: {
            id: "MANDIRI_BILL_BANK_TRANSFER",
            name: "Mandiri Bill",
            isEnabled: true,
            howToPay: howToPay_1.htp_mandiri_bank_transfer,
            description: "Bayar dari ATM Mandiri atau Internet Banking",
            PaymentType: { connect: { id: bankTransfer.id } },
            icon: "/img/payments/bank_transfer/mandiri.svg",
        },
    });
    const bt5 = await seed_1.prisma.paymentService.create({
        data: {
            id: "PERMATA_BANK_TRANSFER",
            name: "Permata",
            isEnabled: true,
            howToPay: howToPay_1.htp_permata_bank_transfer,
            description: "Bayar dari ATM Permata atau Internet Banking",
            PaymentType: { connect: { id: bankTransfer.id } },
            icon: "/img/payments/bank_transfer/permata.svg",
        },
    });
    const cstore = await seed_1.prisma.paymentType.create({
        data: {
            id: "CSTORE",
            name: "Convenience Store",
            description: "Pembayaran dari Indomaret atau Alfamart",
            isEnabled: true,
        },
    });
    const cs1 = await seed_1.prisma.paymentService.create({
        data: {
            id: "INDOMARET_CSTORE",
            name: "Indomaret",
            isEnabled: true,
            howToPay: howToPay_1.htp_indomaret_cstore,
            description: "Bayar dari Indomaret",
            PaymentType: { connect: { id: cstore.id } },
            icon: "/img/payments/cstore/indomaret.svg",
        },
    });
    const cs2 = await seed_1.prisma.paymentService.create({
        data: {
            id: "ALFAMART_CSTORE",
            name: "Alfamart",
            isEnabled: true,
            howToPay: howToPay_1.htp_alfamart_cstore,
            description: "Bayar dari Alfamart",
            PaymentType: { connect: { id: cstore.id } },
            icon: "/img/payments/cstore/alfamart.svg",
        },
    });
    console.log(bankTransfer, bt1, bt2, bt3, bt4, bt5, cstore, cs1, cs2);
};
exports.paymentType = paymentType;
