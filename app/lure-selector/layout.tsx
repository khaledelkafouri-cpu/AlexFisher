import { pageMetadata } from "@/app/seo";

export const metadata = pageMetadata(
  "Lure Selector",
  "Find a suitable fishing lure for the species, water and conditions with the AlexFisher Lure Selector.",
  "/lure-selector",
);

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
