import { pageMetadata } from "@/app/seo";

export const metadata = pageMetadata(
  "Learn Fishing",
  "Build your fishing knowledge with clear AlexFisher guides covering tackle, techniques, species and safer days on the water.",
  "/learning",
);

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
