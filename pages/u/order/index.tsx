import { NextPage } from "next";
import Head from "next/head";
import MakeOrder from "../../../src/components/User/Order";

const Order: NextPage = () => {
  return (
    <>
      <Head>
        <title>Order</title>
        <link rel="icon" href="/icons/dklogo.svg" />
      </Head>
      <MakeOrder />
    </>
  );
};

export default Order;
