import React from "react";
import PropTypes from "prop-types";
import { useSiteMetadata } from "../hooks/useSiteMetadata";

export function Seo({ description, title, children }) {
  const {
    title: defaultTitle,
    description: defaultDescription,
  } = useSiteMetadata();

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
  };

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {children}
    </>
  );
}

Seo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};
