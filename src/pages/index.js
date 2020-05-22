import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { ConvertCurrencyForm } from "../components/ConvertCurrencyForm";

const IndexPage = () => (
  <Layout>
    <SEO title="Currency Converter" />
    <ConvertCurrencyForm />
  </Layout>
);

export default IndexPage;
