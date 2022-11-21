import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/admin/master/products/books",
      permanent: true,
    },
  };
};
const Products = () => {
  return null;
};

export default Products;
