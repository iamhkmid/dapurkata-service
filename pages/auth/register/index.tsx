import Head from "next/head";
import RegisterComp from "../../../src/components/User/Auth/Register";

const register = () => {
  return (
    <>
      <Head>
        <title>Buat Akun Baru</title>
        <link rel="icon" href="/icons/dklogo.svg" />
      </Head>
      <RegisterComp />
    </>
  );
};

export default register;
