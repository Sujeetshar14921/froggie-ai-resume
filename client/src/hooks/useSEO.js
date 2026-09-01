import { useEffect } from "react";

/**
 * Custom hook to dynamically manage Page Title, Meta Description, and Canonical URL for SEO
 * @param {Object} seoConfig
 * @param {string} seoConfig.title - Page title
 * @param {string} seoConfig.description - Page meta description
 * @param {string} [seoConfig.canonical] - Canonical URL
 */
export const useSEO = ({ title, description, canonical }) => {
  useEffect(() => {
    // 1. Update Title
    if (title) {
      document.title = title.includes("froggie") ? title : `${title} | froggie AI Resume Studio`;
    }

    // 2. Update Meta Description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", description);

      // Open Graph Description
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute("content", description);
    }

    // 3. Update Canonical Link
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement("link");
        linkCanonical.setAttribute("rel", "canonical");
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute("href", canonical);
    }
  }, [title, description, canonical]);
};

export default useSEO;
