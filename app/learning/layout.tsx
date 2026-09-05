import { pageMetadata } from "@/app/seo";

export const metadata = pageMetadata(
  "Learn Fishing",
  "Learn fishing step by step with structured AlexFisher courses on rods, reels, hooks, lures and braided line.",
  "/learning",
);

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
