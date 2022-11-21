import { NextPage } from "next";
import Head from "next/head";
import AccountComp from "../../../src/components/User/Account";

const Account: NextPage = () => {
  return (
    <>
      <Head>
        <title>Account</title>
        <link rel="icon" href="/icons/dklogo.svg" />
      </Head>
      <AccountComp />
    </>
  );
};

export default Account;
