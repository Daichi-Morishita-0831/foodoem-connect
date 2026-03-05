const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://foodoem-connect.vercel.app";

export function generateOrganizationLD() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FoodOEM Connect",
    url: SITE_URL,
    description:
      "音声AIであなたの要望を伝えるだけ。最適な食品OEM工場が見つかるマッチングプラットフォーム。",
    sameAs: [],
  };
}

export function generateWebSiteLD() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FoodOEM Connect",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/oem/{search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateOemProfileLD(
  companyName: string,
  description: string,
  averageRating: number,
  reviewCount: number,
  profileId: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: companyName,
    description: description || `${companyName} - 食品OEM工場`,
    url: `${SITE_URL}/oem/${profileId}`,
    "@id": `${SITE_URL}/oem/${profileId}`,
    ...(reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: averageRating,
        reviewCount: reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}
