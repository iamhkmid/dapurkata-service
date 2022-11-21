import { WithAuth } from "../../../../../src/services/WithAuth";
import BooksComp from "../../../../../src/components/Admin/Master/Products/Books";
import Head from "next/head";

const Books = () => {
  return (
    <>
      <Head>
        <title>Books</title>
        <link rel="icon" href="/dklogo.svg" />
      </Head>
      <BooksComp />
    </>
  );
};

export default Books;
