import { pageMetadata } from "@/app/seo";

export const metadata = pageMetadata(
  "Hook Matcher",
  "Choose the right fishing hook for your target species, bait and technique with the AlexFisher Hook Matcher.",
  "/hook-matcher",
);

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
