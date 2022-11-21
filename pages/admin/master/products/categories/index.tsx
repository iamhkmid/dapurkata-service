import { WithAuth } from "../../../../../src/services/WithAuth";
import CategoriesComp from "../../../../../src/components/Admin/Master/Products/Categories";
import Head from "next/head";

const Categories = () => {
  return (
    <>
      <Head>
        <title>Authors</title>
        <link rel="icon" href="/dklogo.svg" />
      </Head>
      <CategoriesComp />
    </>
  );
};

export default Categories;
