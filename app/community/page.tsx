import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from "@/app/chatgpt-auth";
import CommunityClient from "./community-client";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const user = await getChatGPTUser();
  return <CommunityClient user={user ? { displayName: user.displayName, email: user.email } : null} signInPath={chatGPTSignInPath("/community")} signOutPath={chatGPTSignOutPath("/community")} />;
}
