import { getChatGPTUser } from "@/app/chatgpt-auth";
import { createPost, listPosts, type CommunityActivity } from "@/db/community";

const activities = new Set(["fishing", "surfing", "kayaking"]);

export async function GET(request: Request) {
  const activity = new URL(request.url).searchParams.get("activity") ?? "fishing";
  if (!activities.has(activity)) return Response.json({ error: "Invalid activity" }, { status: 400 });
  try { return Response.json({ posts: await listPosts(activity as CommunityActivity) }); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Unable to load posts" }, { status: 500 }); }
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in to post" }, { status: 401 });
  const body = await request.json() as { activity?: string; title?: string; content?: string };
  const activity = body.activity ?? "";
  const title = body.title?.trim() ?? "";
  const content = body.content?.trim() ?? "";
  if (!activities.has(activity) || title.length < 3 || content.length < 3) return Response.json({ error: "Complete the title and question" }, { status: 400 });
  if (title.length > 120 || content.length > 1500) return Response.json({ error: "Post is too long" }, { status: 400 });
  try {
    const id = await createPost({ activity: activity as CommunityActivity, title, content, authorEmail: user.email, authorName: user.displayName });
    return Response.json({ id }, { status: 201 });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Unable to create post" }, { status: 500 }); }
}
