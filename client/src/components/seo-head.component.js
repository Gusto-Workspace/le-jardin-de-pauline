import Head from "next/head";
import { useContext } from "react";
import { GlobalContext } from "@/contexts/global.context";
import {
  DEFAULT_LOGO_IMAGE,
  DEFAULT_SITE_NAME,
  DEFAULT_SOCIAL_IMAGE,
  buildAbsoluteUrl,
  buildSeoSchemas,
  normalizeBaseUrl,
} from "@/utils/seo";

export default function SeoHead({
  title,
  description,
  path = "/",
  image = DEFAULT_SOCIAL_IMAGE,
  type = "website",
  noIndex = false,
  breadcrumbs = [],
  restaurantData = null,
}) {
  const context = useContext(GlobalContext);
  const restaurant = restaurantData || context?.restaurantContext?.restaurantData;
  const baseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_BASE_URL);
  const canonicalUrl = buildAbsoluteUrl(baseUrl, path);
  const imageUrl = buildAbsoluteUrl(baseUrl, image);
  const robots = noIndex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  const schemas = noIndex ? [] : buildSeoSchemas({
    baseUrl,
    restaurant,
    title,
    description,
    canonicalUrl,
    imageUrl,
    breadcrumbs,
  });

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="robots" content={robots} />
      <meta name="author" content={DEFAULT_SITE_NAME} />
      <meta name="application-name" content={DEFAULT_SITE_NAME} />
      <meta name="apple-mobile-web-app-title" content={DEFAULT_SITE_NAME} />
      <meta name="theme-color" content="#667d67" />
      <meta name="format-detection" content="telephone=yes, address=yes, email=yes" />
      {!noIndex ? <link rel="canonical" href={canonicalUrl} /> : null}
      {!noIndex ? <link rel="alternate" hrefLang="fr-FR" href={canonicalUrl} /> : null}
      {!noIndex ? <link rel="alternate" hrefLang="x-default" href={canonicalUrl} /> : null}

      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="993" />
      <meta property="og:image:height" content="713" />
      <meta property="og:image:alt" content={title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={title} />

      {schemas.map((schema, index) => (
        <script
          key={`seo-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </Head>
  );
}
