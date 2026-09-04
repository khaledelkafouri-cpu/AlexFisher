import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AlexFisher Sea Conditions",
    short_name: "AlexFisher",
    description:
      "Live sea conditions and marine forecasts for fishing, surfing and kayaking.",
    start_url: "/",
    display: "standalone",
    background_color: "#071f29",
    theme_color: "#071f29",
    icons: [
      {
        src: "/assets/alexfisher-sunfish-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
