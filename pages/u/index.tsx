import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/u/account",
      permanent: true,
    },
  };
};
const User = () => {
  return null;
};

export default User;
