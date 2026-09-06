import { pageMetadata } from "@/app/seo";

export const metadata = pageMetadata(
  "Hook Matcher",
  "Find natural-bait hooks for MENA fishing. Compare eyed and spade-end hook images, bait sizes, wire strength and hook-setting techniques.",
  "/hook-matcher",
);

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
