import { pageMetadata } from "@/app/seo";

export const metadata = pageMetadata(
  "Fishing Gear Shop",
  "Explore fishing gear and equipment selected for practical days on the water at the AlexFisher shop.",
  "/shop",
);

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
