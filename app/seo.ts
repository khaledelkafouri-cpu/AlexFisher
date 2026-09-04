import type { Metadata } from "next";

export const siteUrl = "https://www.alexfisherofficial.com";

export function pageMetadata(
  title: string,
  description: string,
  path: `/${string}`,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: "AlexFisher",
      title: `${title} | AlexFisher`,
      description,
      images: [
        {
          url: "/og.png",
          width: 1730,
          height: 909,
          alt: "AlexFisher — Know the sea. Own the day.",
        },
      ],
    },
  };
}
