import Head from "next/head";
import OrdersElement from "../../../src/components/Admin/Transactions/Orders";

const Orders = () => {
  return (
    <>
      <Head>
        <title>Orders</title>
        <link rel="icon" href="/dklogo.svg" />
      </Head>
      <OrdersElement />
    </>
  );
};

export default Orders;
