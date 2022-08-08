import React from "react";

import Layout from "../components/layout";
import { Seo } from "../components/seo";
import { ConvertCurrencyForm } from "../components/ConvertCurrencyForm";

const IndexPage = () => (
  <Layout>
    <ConvertCurrencyForm />
  </Layout>
);

export default IndexPage;

export const Head = () => <Seo />;
