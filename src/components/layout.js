/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";

import Header from "./header";
import "./layout.css";

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <div
      style={{
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `space-between`,
        alignItems: `center`,
        minHeight: `100vh`,
      }}
    >
      <Header siteTitle={data.site.siteMetadata.title} />
      <main
        style={{
          flexGrow: 1,
          display: `flex`,
          justifyContent: "center",
          width: `100%`,
        }}
      >
        {children}
      </main>
      <footer style={{ textAlign: `center`, padding: `1em 0.5em` }}>
        © {new Date().getFullYear()},{" "}
        <a href="https://maxbibikov.com">Maksym Bibikov</a>
        {` `}
        <div>
          Icons made by{" "}
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
      </footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
