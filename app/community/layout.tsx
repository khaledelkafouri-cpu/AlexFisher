import { pageMetadata } from "@/app/seo";

export const metadata = pageMetadata(
  "Fishing Community",
  "Join the AlexFisher community to share catches, local knowledge and experiences from the water.",
  "/community",
);

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
