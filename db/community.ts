import { env } from "cloudflare:workers";

export type CommunityActivity = "fishing" | "surfing" | "kayaking";
export type CommunityComment = { id: number; postId: number; content: string; authorName: string; createdAt: string };
export type CommunityPost = { id: number; activity: CommunityActivity; title: string; content: string; authorName: string; createdAt: string; comments: CommunityComment[] };

function database() {
  if (!env.DB) throw new Error("Community database is unavailable");
  return env.DB;
}

export async function listPosts(activity: CommunityActivity): Promise<CommunityPost[]> {
  const postsResult = await database().prepare(`
    SELECT id, activity, title, content, author_name AS authorName, created_at AS createdAt
    FROM community_posts WHERE activity = ? ORDER BY created_at DESC, id DESC LIMIT 50
  `).bind(activity).all<Omit<CommunityPost, "comments">>();
  const commentsResult = await database().prepare(`
    SELECT c.id, c.post_id AS postId, c.content, c.author_name AS authorName, c.created_at AS createdAt
    FROM community_comments c INNER JOIN community_posts p ON p.id = c.post_id
    WHERE p.activity = ? ORDER BY c.created_at ASC, c.id ASC
  `).bind(activity).all<CommunityComment>();
  const comments = commentsResult.results ?? [];
  return (postsResult.results ?? []).map((post) => ({ ...post, comments: comments.filter((comment) => comment.postId === post.id) }));
}

export async function createPost(input: { activity: CommunityActivity; title: string; content: string; authorEmail: string; authorName: string }) {
  const result = await database().prepare(`
    INSERT INTO community_posts (activity, title, content, author_email, author_name) VALUES (?, ?, ?, ?, ?)
  `).bind(input.activity, input.title, input.content, input.authorEmail, input.authorName).run();
  return Number(result.meta.last_row_id);
}

export async function createComment(input: { postId: number; content: string; authorEmail: string; authorName: string }) {
  const result = await database().prepare(`
    INSERT INTO community_comments (post_id, content, author_email, author_name) VALUES (?, ?, ?, ?)
  `).bind(input.postId, input.content, input.authorEmail, input.authorName).run();
  return Number(result.meta.last_row_id);
}
