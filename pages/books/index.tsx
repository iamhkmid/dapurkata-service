import Head from "next/head";
import BooksComp from "../../src/components/User/Books";

const Store = () => {
  return (
    <>
      <Head>
        <title>Buku</title>
        <link rel="icon" href="/dklogo.svg" />
      </Head>
      <BooksComp />
    </>
  );
};

export default Store;
