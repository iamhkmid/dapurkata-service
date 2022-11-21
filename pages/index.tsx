import Head from "next/head";
import Homepage from "../src/components/User/Homepage";
import { GetStaticProps } from "next";
import { FC } from "react";
import data from "../src/data/content";

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: { data },
  };
};
type THome = {
  data: any;
};

const Home: FC<THome> = ({ data }) => {
  return (
    <>
      <Head>
        <title>Homepage</title>
        <link rel="icon" href="/dklogo.svg" />
      </Head>
      <Homepage data={data} />
    </>
  );
};

export default Home;
