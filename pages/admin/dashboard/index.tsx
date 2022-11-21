import { WithAuth } from "../../../src/services/WithAuth";
import DashboardComp from "../../../src/components/Admin/Dashboard";
import Head from "next/head";

const Dashboard = (props) => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <link rel="icon" href="/dklogo.svg" />
      </Head>
      <DashboardComp />
    </>
  );
};

export default Dashboard;
