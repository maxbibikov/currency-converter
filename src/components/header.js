import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";

const Header = ({ siteTitle }) => (
  <header
    style={{
      marginBottom: `1.45rem`,
      width: `100%`,
    }}
  >
    <div
      style={{
        height: `8px`,
        width: `100%`,
        backgroundImage: `linear-gradient( 109.6deg,  rgba(255,207,84,1) 11.2%, rgba(255,158,27,1) 91.1% )`,
      }}
    ></div>
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <h1 style={{ margin: 0, textAlign: `center` }}>
        <Link
          to="/"
          style={{
            color: `#000000`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
    </div>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
