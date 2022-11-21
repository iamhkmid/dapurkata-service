import PublisherComp from "../../../../../src/components/Admin/Master/Products/Publisher";
import Head from "next/head";

const Publishers = (props) => {
  return (
    <>
      <Head>
        <title>Publisher</title>
        <link rel="icon" href="/dklogo.svg" />
      </Head>
      <PublisherComp />
    </>
  );
};

export default Publishers;
