import Head from "next/head";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/admin/content/footer",
      permanent: true,
    },
  };
};
const Master = () => {
  return null;
};
export default Master;
