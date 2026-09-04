import { pageMetadata } from "@/app/seo";

export const metadata = pageMetadata(
  "Fishing Hub",
  "Plan your next fishing trip with practical tools, marine conditions and local fishing guidance from AlexFisher.",
  "/fishing-hub",
);

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
