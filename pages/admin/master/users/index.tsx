import Head from "next/head";
import UsersComp from "../../../../src/components/Admin/Master/Users";

const Users = () => {
  return (
    <>
      <Head>
        <title>Users</title>
        <link rel="icon" href="/dklogo.svg" />
      </Head>
      <UsersComp />
    </>
  );
};

export default Users;
