import Head from "next/head";
import LoginComp from "../../../src/components/User/Auth/Login";

const Login = () => {
  return (
    <>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/icons/dklogo.svg" />
      </Head>
      <LoginComp />
    </>
  );
};

export default Login;
