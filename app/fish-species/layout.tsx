import {pageMetadata} from "@/app/seo";

export const metadata=pageMetadata(
  "Mediterranean Fish Species Guide",
  "Identify local Mediterranean fish and learn their seasons, habitat, bait and recommended fishing methods.",
  "/fish-species",
);

export default function Layout({children}:Readonly<{children:React.ReactNode}>){return children}
