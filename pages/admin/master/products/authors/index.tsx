import AuthorsComp from "../../../../../src/components/Admin/Master/Products/Authors";
import Head from "next/head";

const Authors = (props) => {
  return (
    <>
      <Head>
        <title>Authors</title>
        <link rel="icon" href="/dklogo.svg" />
      </Head>
      <AuthorsComp />
    </>
  );
};

export default Authors;
