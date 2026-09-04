import { getChatGPTUser } from "@/app/chatgpt-auth";
import { createComment } from "@/db/community";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in to comment" }, { status: 401 });
  const { id } = await context.params;
  const postId = Number(id);
  const body = await request.json() as { content?: string };
  const content = body.content?.trim() ?? "";
  if (!Number.isInteger(postId) || postId < 1 || content.length < 2 || content.length > 800) return Response.json({ error: "Write a valid comment" }, { status: 400 });
  try { return Response.json({ id: await createComment({ postId, content, authorEmail: user.email, authorName: user.displayName }) }, { status: 201 }); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Unable to comment" }, { status: 500 }); }
}
