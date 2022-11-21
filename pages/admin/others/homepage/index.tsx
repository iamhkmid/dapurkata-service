import { WithAuth } from "../../../../src/services/WithAuth";
import DashboardComp from "../../../../src/components/Admin/Dashboard";
import Head from "next/head";

const Homepage = (props) => {
  return (
    <>
      <Head>
        <title>Homepage info</title>
        <link rel="icon" href="/dklogo.svg" />
      </Head>
    </>
  );
};

export default Homepage;
