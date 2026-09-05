"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Fish, LoaderCircle, MessageCircle, Send, ShipWheel, Users, Waves } from "lucide-react";
import type { CommunityActivity, CommunityPost } from "@/db/community";
import BottomNav from "@/components/BottomNav";

const groups = [
  { id: "fishing" as const, label: "Fishing", detail: "Catches, locations and conditions", icon: Fish },
  { id: "surfing" as const, label: "Surfing", detail: "Swell reports and surf questions", icon: Waves },
  { id: "kayaking" as const, label: "Kayaking", detail: "Trips, safety and launch points", icon: ShipWheel },
];

export default function CommunityClient({ user, signInPath, signOutPath }: { user: { displayName: string; email: string } | null; signInPath: string; signOutPath: string }) {
  const [activity, setActivity] = useState<CommunityActivity>("fishing");
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});
  const [message, setMessage] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true); setMessage("");
    try {
      const response = await fetch(`/api/community/posts?activity=${activity}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to load posts");
      setPosts(data.posts ?? []);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to load posts"); }
    finally { setLoading(false); }
  }, [activity]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  async function submitPost(event: React.FormEvent) {
    event.preventDefault(); setSubmitting(true); setMessage("");
    try {
      const response = await fetch("/api/community/posts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ activity, title, content }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to post");
      setTitle(""); setContent(""); await loadPosts();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to post"); }
    finally { setSubmitting(false); }
  }

  async function submitComment(postId: number) {
    const draft = commentDrafts[postId]?.trim();
    if (!draft) return;
    setSubmitting(true); setMessage("");
    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ content: draft }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to comment");
      setCommentDrafts((current) => ({ ...current, [postId]: "" })); await loadPosts();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to comment"); }
    finally { setSubmitting(false); }
  }

  return <main className="community-page">
    <header className="community-topbar">
      <a href="/" className="back-link"><ArrowLeft size={17}/> Back to conditions</a>
      <a className="brand" href="/"><span className="brand-mark"><Waves size={22}/></span><span>ALEX<strong>FISHER</strong><small>SEA COMMUNITY</small></span></a>
      {user ? <div className="community-account"><span>{user.displayName}</span><a href={signOutPath} target="_top">Sign out</a></div> : <a className="community-signin" href={signInPath} target="_top">Sign in to participate</a>}
    </header>

    <section className="community-hero">
      <p>LOCAL KNOWLEDGE · REAL CONDITIONS</p><h1>Ask. Share. Get on the water.</h1>
      <span>Choose your activity, ask the people who do it, and add what you are seeing at the coast.</span>
    </section>

    <div className="community-app">
      <aside className="community-channels">
        <p><Users size={15}/> COMMUNITY GROUPS</p>
        {groups.map((group) => { const Icon = group.icon; return <button key={group.id} className={activity === group.id ? "active" : ""} onClick={() => setActivity(group.id)}><Icon size={21}/><span><strong>{group.label}</strong><small>{group.detail}</small></span></button>; })}
      </aside>

      <section className="community-feed">
        <div className="feed-heading"><div><small>{groups.find((group) => group.id === activity)?.label} community</small><h2>Questions & local reports</h2></div><span>{posts.length} posts</span></div>
        {user ? <form className="community-composer" onSubmit={submitPost}>
          <div className="composer-avatar">{user.displayName.slice(0, 2).toUpperCase()}</div>
          <div><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What do you want to ask?" maxLength={120} required/><textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Add the location, time and useful details..." maxLength={1500} required/><button disabled={submitting}>{submitting ? <LoaderCircle className="spin" size={16}/> : <Send size={16}/>} Publish question</button></div>
        </form> : <div className="signin-prompt"><MessageCircle size={25}/><div><strong>Join the conversation</strong><p>Sign in to ask questions, share a report and comment.</p></div><a href={signInPath} target="_top">Sign in with ChatGPT</a></div>}
        {message && <p className="community-message">{message}</p>}
        {loading ? <div className="community-loading"><LoaderCircle className="spin"/> Loading community…</div> : posts.length === 0 ? <div className="community-empty"><MessageCircle size={30}/><h3>Start the first conversation</h3><p>Ask about today’s conditions, a location, equipment or safety.</p></div> : <div className="posts-list">{posts.map((post) => <article className="community-post" key={post.id}>
          <div className="post-meta"><div className="composer-avatar small">{post.authorName.slice(0, 2).toUpperCase()}</div><div><strong>{post.authorName}</strong><span>{new Date(post.createdAt).toLocaleString()}</span></div></div>
          <h3>{post.title}</h3><p>{post.content}</p>
          <div className="comments-label"><MessageCircle size={15}/> {post.comments.length} comments</div>
          {post.comments.map((comment) => <div className="community-comment" key={comment.id}><strong>{comment.authorName}</strong><span>{comment.content}</span><small>{new Date(comment.createdAt).toLocaleString()}</small></div>)}
          {user && <div className="comment-box"><input value={commentDrafts[post.id] ?? ""} onChange={(event) => setCommentDrafts((current) => ({ ...current, [post.id]: event.target.value }))} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); submitComment(post.id); } }} placeholder="Add a helpful comment…" maxLength={800}/><button disabled={submitting || !commentDrafts[post.id]?.trim()} onClick={() => submitComment(post.id)}><Send size={15}/></button></div>}
        </article>)}</div>}
      </section>
    </div>
    <BottomNav active="community" />
  </main>;
}
