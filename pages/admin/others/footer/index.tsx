import { WithAuth } from "../../../../src/services/WithAuth";
import DashboardComp from "../../../../src/components/Admin/Dashboard";
import Head from "next/head";
import FooterInfo from "../../../../src/components/Admin/FooterInfo";

const Footer = (props) => {
  return (
    <>
      <Head>
        <title>Footer info</title>
        <link rel="icon" href="/dklogo.svg" />
      </Head>
      <FooterInfo />
    </>
  );
};

export default Footer;
