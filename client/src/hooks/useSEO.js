import { useEffect } from "react";

/**
 * Custom hook to dynamically manage Page Title, Meta Description, Keywords, Canonical URL,
 * Open Graph, Twitter cards, and Schema.org structured data for #1 Google Search Ranking.
 *
 * @param {Object} seoConfig
 * @param {string} seoConfig.title - Page title
 * @param {string} seoConfig.description - Page meta description
 * @param {string} [seoConfig.keywords] - Comma separated SEO keywords
 * @param {string} [seoConfig.canonical] - Canonical URL
 * @param {string} [seoConfig.ogImage] - Open Graph & Twitter share preview image URL
 * @param {Object} [seoConfig.schema] - Optional JSON-LD structured data object
 */
export const useSEO = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = "https://froggie.site/og-image.png",
  schema,
}) => {
  useEffect(() => {
    // 1. Update Title
    if (title) {
      const fullTitle = title.includes("froggie") ? title : `${title} | froggie AI Resume Studio`;
      document.title = fullTitle;

      // OG Title
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute("content", fullTitle);

      // Twitter Title
      let twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute("content", fullTitle);
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

      // Twitter Description
      let twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute("content", description);
    }

    // 3. Update Keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", keywords);
    }

    // 4. Update Canonical Link and URLs
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement("link");
        linkCanonical.setAttribute("rel", "canonical");
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute("href", canonical);

      // Open Graph URL
      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute("content", canonical);

      // Twitter URL
      let twUrl = document.querySelector('meta[name="twitter:url"]');
      if (twUrl) twUrl.setAttribute("content", canonical);
    }

    // 5. Update Open Graph & Twitter Image
    if (ogImage) {
      let ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute("content", ogImage);

      let twImg = document.querySelector('meta[name="twitter:image"]');
      if (twImg) twImg.setAttribute("content", ogImage);
    }

    // 6. Inject Route-Specific JSON-LD Schema (if provided)
    if (schema) {
      let schemaScript = document.getElementById("dynamic-route-schema");
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.id = "dynamic-route-schema";
        schemaScript.type = "application/ld+json";
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    }

    return () => {
      // Cleanup route-specific schema when unmounting route
      const dynamicSchema = document.getElementById("dynamic-route-schema");
      if (dynamicSchema) {
        dynamicSchema.remove();
      }
    };
  }, [title, description, keywords, canonical, ogImage, schema]);
};

export default useSEO;
