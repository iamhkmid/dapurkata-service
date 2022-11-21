import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/admin/dashboard",
      permanent: true,
    },
  };
};
const Admin = () => {
  return null;
};

export default Admin;
