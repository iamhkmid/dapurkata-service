import { prisma } from "../seed";
import {
  htp_alfamart_cstore,
  htp_bca_bank_transfer,
  htp_bni_bank_transfer,
  htp_bri_bank_transfer,
  htp_indomaret_cstore,
  htp_mandiri_bank_transfer,
  htp_permata_bank_transfer,
} from "./howToPay";

export const paymentType = async () => {
  const bankTransfer = await prisma.paymentType.create({
    data: {
      id: "BANK_TRANSFER",
      name: "ATM/Bank Transfer",
      description: "Bayar dari ATM atau Internet Banking",
      isEnabled: true,
    },
  });
  const bt1 = await prisma.paymentService.create({
    data: {
      id: "BCA_BANK_TRANSFER",
      name: "BCA",
      isEnabled: true,
      howToPay: htp_bca_bank_transfer,
      description: "Bayar dari ATM BCA atau Internet Banking",
      PaymentType: { connect: { id: bankTransfer.id } },
      icon: "/img/payments/bank_transfer/bca.svg",
    },
  });
  const bt2 = await prisma.paymentService.create({
    data: {
      id: "BNI_BANK_TRANSFER",
      name: "BNI",
      isEnabled: true,
      howToPay: htp_bni_bank_transfer,
      description: "Bayar dari ATM BNI atau Internet Banking",
      PaymentType: { connect: { id: bankTransfer.id } },
      icon: "/img/payments/bank_transfer/bni.svg",
    },
  });
  const bt3 = await prisma.paymentService.create({
    data: {
      id: "BRI_BANK_TRANSFER",
      name: "BRI",
      isEnabled: true,
      howToPay: htp_bri_bank_transfer,
      description: "Bayar dari ATM BRI atau Internet Banking",
      PaymentType: { connect: { id: bankTransfer.id } },
      icon: "/img/payments/bank_transfer/bri.svg",
    },
  });
  const bt4 = await prisma.paymentService.create({
    data: {
      id: "MANDIRI_BILL_BANK_TRANSFER",
      name: "Mandiri Bill",
      isEnabled: true,
      howToPay: htp_mandiri_bank_transfer,
      description: "Bayar dari ATM Mandiri atau Internet Banking",
      PaymentType: { connect: { id: bankTransfer.id } },
      icon: "/img/payments/bank_transfer/mandiri.svg",
    },
  });
  const bt5 = await prisma.paymentService.create({
    data: {
      id: "PERMATA_BANK_TRANSFER",
      name: "Permata",
      isEnabled: true,
      howToPay: htp_permata_bank_transfer,
      description: "Bayar dari ATM Permata atau Internet Banking",
      PaymentType: { connect: { id: bankTransfer.id } },
      icon: "/img/payments/bank_transfer/permata.svg",
    },
  });
  const cstore = await prisma.paymentType.create({
    data: {
      id: "CSTORE",
      name: "Convenience Store",
      description: "Pembayaran dari Indomaret atau Alfamart",
      isEnabled: true,
    },
  });
  const cs1 = await prisma.paymentService.create({
    data: {
      id: "INDOMARET_CSTORE",
      name: "Indomaret",
      isEnabled: true,
      howToPay: htp_indomaret_cstore,
      description: "Bayar dari Indomaret",
      PaymentType: { connect: { id: cstore.id } },
      icon: "/img/payments/cstore/indomaret.svg",
    },
  });
  const cs2 = await prisma.paymentService.create({
    data: {
      id: "ALFAMART_CSTORE",
      name: "Alfamart",
      isEnabled: true,
      howToPay: htp_alfamart_cstore,
      description: "Bayar dari Alfamart",
      PaymentType: { connect: { id: cstore.id } },
      icon: "/img/payments/cstore/alfamart.svg",
    },
  });

  console.log(bankTransfer, bt1, bt2, bt3, bt4, bt5, cstore, cs1, cs2);
};
