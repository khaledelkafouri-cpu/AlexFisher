import { pageMetadata } from "@/app/seo";

export const metadata = pageMetadata(
  "Read My Fishing Spot",
  "Understand a fishing spot using structure, water movement and conditions with AlexFisher's spot-reading tool.",
  "/read-my-spot",
);

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
