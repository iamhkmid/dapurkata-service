import Head from "next/head";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/admin/transaction/orders",
      permanent: true,
    },
  };
};
const Transactions = () => {
  return null;
};
export default Transactions;
