import type { Metadata } from "next";
import MembershipGate from "@/components/MembershipGate";
import "./globals.css";

const siteUrl = "https://www.alexfisherofficial.com";
const siteTitle = "AlexFisher | Live Sea Conditions & Marine Forecasts";
const siteDescription =
  "Live sea conditions, tides, wind, waves and activity forecasts for fishing, surfing and kayaking across Egypt and the wider region.";
const socialProfiles = [
  "https://www.youtube.com/@alexfisher_khaled",
  "https://www.instagram.com/alexfisher_khaled/",
  "https://www.facebook.com/AlexFisher.Fishing.Vlogs",
  "https://www.tiktok.com/@alexfisher_khaled",
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "AlexFisher",
  title: {
    default: siteTitle,
    template: "%s | AlexFisher",
  },
  description: siteDescription,
  keywords: [
    "AlexFisher",
    "sea conditions",
    "marine forecast",
    "fishing forecast",
    "wave forecast",
    "tide forecast",
    "surf forecast",
    "kayaking conditions",
  ],
  creator: "AlexFisher",
  publisher: "AlexFisher",
  category: "Marine weather",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/assets/alexfisher-sunfish-logo.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/assets/alexfisher-sunfish-logo.png",
    apple: [{ url: "/assets/alexfisher-sunfish-logo.png", sizes: "512x512" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "AlexFisher",
    title: siteTitle,
    description: siteDescription,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1730,
        height: 909,
        alt: "AlexFisher — Know the sea. Own the day.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "AlexFisher",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/assets/alexfisher-sunfish-logo.png`,
        width: 512,
        height: 512,
      },
      sameAs: socialProfiles,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "AlexFisher",
      alternateName: "AlexFisher Sea Conditions",
      description: siteDescription,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: ["en", "ar"],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <MembershipGate>{children}</MembershipGate>
      </body>
    </html>
  );
}
