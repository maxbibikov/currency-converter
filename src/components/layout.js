import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import styled from "styled-components";

// Components
import Header from "./header";
import "./layout.css";

const SiteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
`;

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 60%;
`;

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
    <SiteContainer>
      <Header siteTitle={data.site.siteMetadata.title} />
      <MainContainer>{children}</MainContainer>
      <footer style={{ textAlign: `center`, padding: `1em 0.5em` }}>
        © {new Date().getFullYear()}, <a href="https://maxbibikov.com">Max</a> /{" "}
        <a href="https://github.com/maxbibikov/currency-converter">
          Source Code
        </a>
        <div>
          Icons made by{" "}
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik,
          </a>{" "}
          <a
            href="https://www.flaticon.com/authors/smartline"
            title="Smartline"
          >
            Smartline
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
      </footer>
    </SiteContainer>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
