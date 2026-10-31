import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { DEFAULT_OG_IMAGE, SITE_NAME, seoForPath } from "@/config/seo";
import { jsonLdForPath } from "@/config/jsonLd";

export default function SeoHead() {
  const { pathname } = useLocation();
  const seo = seoForPath(pathname);
  const robots = seo.noindex ? "noindex, nofollow" : "index, follow";
  const jsonLd = jsonLdForPath(pathname);

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.canonical} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={seo.ogType || "website"} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={seo.canonical} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      {jsonLd ? <script type="application/ld+json">{JSON.stringify(jsonLd)}</script> : null}
    </Helmet>
  );
}
