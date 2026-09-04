import type { MetadataRoute } from "next";

const baseUrl = "https://www.alexfisherofficial.com";

const routes = [
  "",
  "/community",
  "/fishing-hub",
  "/hook-matcher",
  "/learning",
  "/lure-selector",
  "/read-my-spot",
  "/shop",
  "/tackle-matcher",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
