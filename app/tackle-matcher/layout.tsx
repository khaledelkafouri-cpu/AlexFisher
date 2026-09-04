import { pageMetadata } from "@/app/seo";

export const metadata = pageMetadata(
  "Tackle Matcher",
  "Match rods, reels, line and tackle to your fishing style and target species with the AlexFisher Tackle Matcher.",
  "/tackle-matcher",
);

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
