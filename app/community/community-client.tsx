"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bell, Camera, Check, ChevronDown, Fish, ImagePlus, LoaderCircle, LogOut, Menu, MessageCircle, Pencil, Search, Send, ShieldOff, ShipWheel, SmilePlus, Sparkles, Trash2, Users, Waves, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import BottomNav from "@/components/BottomNav";
import { createSupabaseClient } from "@/lib/supabase/client";

type Activity = "fishing" | "surfing" | "kayaking";
type Profile = { display_name: string; role: string; banned?: boolean };
type Attachment = { id: string; public_url: string; file_name: string; mime_type: string };
type Reaction = { emoji: string; user_id: string };
type Msg = { id: string; channel: Activity; content: string; author_id: string; parent_id: string | null; created_at: string; profiles: Profile | null; community_attachments: Attachment[]; community_reactions: Reaction[] };

const channels = [
  { id: "fishing" as const, label: "Fishing", detail: "Catches, tackle & local reports", icon: Fish },
  { id: "surfing" as const, label: "Surfing", detail: "Swell, breaks & sessions", icon: Waves },
  { id: "kayaking" as const, label: "Kayaking", detail: "Routes, launches & safety", icon: ShipWheel },
];
const emojis = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🔥", "🎉", "🎣", "🌊", "👏", "😎"];
const quickEmojis = ["👍", "❤️", "😂", "🎣"];
const maxImages = 5;

const initials = (s: string) => s.split(/\s+/).map(x => x[0]).join("").slice(0, 2).toUpperCase();
const ago = (s: string) => { const n = Math.max(1, (Date.now() - new Date(s).getTime()) / 1000); return n < 60 ? "now" : n < 3600 ? `${Math.floor(n / 60)}m` : n < 86400 ? `${Math.floor(n / 3600)}h` : `${Math.floor(n / 86400)}d`; };

export default function Community() {
  const db = useMemo(createSupabaseClient, []);
  const fileInput = useRef<HTMLInputElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activity, setActivity] = useState<Activity>("fishing");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [reply, setReply] = useState<Msg | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menu, setMenu] = useState(false);
  const [picker, setPicker] = useState<string | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const pendingScroll = useRef(false);

  const isStaff = profile?.role === "admin" || profile?.role === "moderator";

  useEffect(() => {
    if (!pendingScroll.current) return;
    pendingScroll.current = false;
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const load = useCallback(async () => {
    if (!db) return;
    const { data, error } = await db.from("community_messages").select("id,channel,content,author_id,parent_id,created_at,profiles!community_messages_author_id_fkey(display_name,role,banned),community_attachments(id,public_url,file_name,mime_type),community_reactions(emoji,user_id)").eq("channel", activity).order("created_at").limit(200);
    setError(error?.message ?? "");
    if (data) setMessages(data as unknown as Msg[]);
    setLoading(false);
  }, [activity, db]);

  useEffect(() => {
    db?.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: p } = await db.from("profiles").select("display_name,role,banned").eq("id", data.user.id).single();
        setProfile(p);
      }
    });
  }, [db]);

  useEffect(() => {
    setLoading(true);
    load();
    if (!db) return;
    const c = db.channel(`room:${activity}`).on("postgres_changes", { event: "*", schema: "public", table: "community_messages", filter: `channel=eq.${activity}` }, load).on("postgres_changes", { event: "*", schema: "public", table: "community_reactions" }, load).subscribe();
    return () => { db.removeChannel(c); };
  }, [activity, db, load]);

  async function send() {
    if (!db || !user || (!draft.trim() && !files.length)) return;
    setBusy(true);
    const { data: m, error: e } = await db.from("community_messages").insert({ channel: activity, content: draft.trim(), author_id: user.id, parent_id: reply?.id ?? null }).select("id").single();
    if (e) { setError(e.message); setBusy(false); return; }
    if (files.length && m) {
      for (const f of files) {
        const clean = f.name.replace(/[^\w.-]/g, "-");
        const path = `${user.id}/${m.id}/${crypto.randomUUID()}-${clean}`;
        const { error: u } = await db.storage.from("community-media").upload(path, f);
        if (u) { setError(u.message); continue; }
        const { data } = db.storage.from("community-media").getPublicUrl(path);
        const { error: a } = await db.from("community_attachments").insert({ message_id: m.id, owner_id: user.id, storage_path: path, public_url: data.publicUrl, file_name: f.name, mime_type: f.type, size_bytes: f.size });
        if (a) setError(a.message);
      }
    }
    setDraft(""); setFiles([]); setReply(null); setEmojiOpen(false);
    pendingScroll.current = true;
    await load(); setBusy(false);
  }

  async function react(m: Msg, emoji: string) {
    if (!db || !user) return;
    const exists = m.community_reactions.some(r => r.emoji === emoji && r.user_id === user.id);
    const q = exists ? db.from("community_reactions").delete().eq("message_id", m.id).eq("user_id", user.id).eq("emoji", emoji) : db.from("community_reactions").insert({ message_id: m.id, user_id: user.id, emoji });
    const { error } = await q;
    pendingScroll.current = true;
    if (error) setError(error.message); else await load();
    setPicker(null);
  }

  async function saveEdit(id: string) {
    if (!db || !editDraft.trim()) return;
    const { error } = await db.from("community_messages").update({ content: editDraft.trim() }).eq("id", id);
    if (error) setError(error.message); else { setEditingId(null); await load(); }
  }

  async function removeMessage(id: string) {
    if (!db || !confirm("Delete this message?")) return;
    const { error } = await db.from("community_messages").delete().eq("id", id);
    if (error) setError(error.message); else await load();
  }

  async function blockAuthor(authorId: string) {
    if (!db || !confirm("Block this member from posting in the community?")) return;
    const { error } = await db.from("profiles").update({ banned: true }).eq("id", authorId);
    if (error) setError(error.message); else await load();
  }

  const room = channels.find(x => x.id === activity)!;
  const RoomIcon = room.icon;
  const name = profile?.display_name || user?.email || "Member";
  const roots = messages.filter(m => !m.parent_id);

  return <main className="discord">
    <header className="discord-head">
      <button onClick={() => setMenu(true)}><Menu /></button>
      <Link href="/"><i><Waves /></i>ALEX<strong>FISHER</strong><small>COMMUNITY</small></Link>
      <div><Search /><input placeholder="Search community" /><kbd>⌘ K</kbd></div>
      <button><Bell /></button>
    </header>
    <nav className="channel-tabs">
      {channels.map(c => { const Icon = c.icon; return <button key={c.id} className={activity === c.id ? "active" : ""} onClick={() => setActivity(c.id)}><Icon size={16} />{c.label}</button>; })}
    </nav>
    <div className="discord-grid">
      <aside className={menu ? "open" : ""}>
        <button className="close" onClick={() => setMenu(false)}><X /></button>
        <hgroup><small>ALEXFISHER COMMUNITY</small><h2>Choose your water</h2></hgroup>
        <p><ChevronDown /> CHANNELS</p>
        {channels.map(c => { const Icon = c.icon; return <button className={activity === c.id ? "active" : ""} key={c.id} onClick={() => { setActivity(c.id); setMenu(false); }}><Icon /><span><b>{c.label}</b><small>{c.detail}</small></span></button>; })}
        <section><Sparkles /><span><b>Keep it useful</b><small>Share real conditions, protect sensitive spots, and look out for each other.</small></span></section>
        <footer><i>{initials(name)}</i><span><b>{name}</b><small>● Online · Free member</small></span><button onClick={() => db?.auth.signOut()}><LogOut /></button></footer>
      </aside>
      {menu && <button className="scrim" onClick={() => setMenu(false)} />}
      <section className="chat">
        <header><i><RoomIcon /></i><span><h1>{room.label}</h1><p>{room.detail}</p></span><b><Users /> AlexFisher members</b></header>
        <div className="feed" ref={feedRef}>
          {loading ? <div className="state"><LoaderCircle className="spin" />Loading conversation…</div>
            : error && !messages.length ? <div className="state"><MessageCircle /><h2>Connect the community database</h2><p>{error}</p></div>
            : !roots.length ? <div className="state"><RoomIcon /><h2>Welcome to #{activity}</h2><p>Ask a question, share today&apos;s conditions or post a photo.</p></div>
            : roots.map(m => {
              const reactions = Object.groupBy(m.community_reactions, r => r.emoji);
              const canModerate = isStaff && m.author_id !== user?.id;
              return <article key={m.id}>
                <i>{initials(m.profiles?.display_name ?? "Member")}</i>
                <div>
                  <header>
                    <b>{m.profiles?.display_name ?? "Member"}</b>
                    {m.profiles?.role === "admin" && <em>CREW</em>}
                    {m.profiles?.banned && <em className="banned-tag">BLOCKED</em>}
                    <time>{ago(m.created_at)}</time>
                  </header>
                  {editingId === m.id ? <div className="edit-box">
                    <textarea value={editDraft} onChange={e => setEditDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveEdit(m.id); } }} autoFocus />
                    <button onClick={() => saveEdit(m.id)}><Check /> Save</button>
                    <button onClick={() => setEditingId(null)}><X /> Cancel</button>
                  </div> : <p>{m.content}</p>}
                  {m.community_attachments.map(a => <a key={a.id} href={a.public_url} target="_blank"><img src={a.public_url} alt={a.file_name} /></a>)}
                  <nav>
                    {Object.entries(reactions).map(([emoji, items]) => <button key={emoji} onClick={() => react(m, emoji)}>{emoji} {items?.length}</button>)}
                    <span className="quick-react">{quickEmojis.map(e => <button key={e} onClick={() => react(m, e)}>{e}</button>)}</span>
                    <button onClick={() => setPicker(picker === m.id ? null : m.id)}><SmilePlus /> React</button>
                    <button onClick={() => setReply(m)}><MessageCircle /> Reply</button>
                    {m.author_id === user?.id && <button onClick={() => { setEditingId(m.id); setEditDraft(m.content); }}><Pencil /> Edit</button>}
                    {(m.author_id === user?.id || isStaff) && <button className="danger" onClick={() => removeMessage(m.id)}><Trash2 /> Delete</button>}
                    {canModerate && !m.profiles?.banned && <button className="danger" onClick={() => blockAuthor(m.author_id)}><ShieldOff /> Block</button>}
                    {picker === m.id && <span>{emojis.map(e => <button key={e} onClick={() => react(m, e)}>{e}</button>)}</span>}
                  </nav>
                  {messages.filter(x => x.parent_id === m.id).map(r => <section className="thread" key={r.id}><i>{initials(r.profiles?.display_name ?? "M")}</i><div><b>{r.profiles?.display_name ?? "Member"}</b><time>{ago(r.created_at)}</time><p>{r.content}</p></div></section>)}
                </div>
              </article>;
            })}
        </div>
        {error && messages.length > 0 && <output>{error}</output>}
        <div className="chatbox">
          {profile?.banned ? <p className="blocked-notice">You&apos;ve been blocked from posting in the community.</p> : <>
            {reply && <p>Replying to <b>{reply.profiles?.display_name}</b><button onClick={() => setReply(null)}><X /></button></p>}
            {files.map((f, i) => <p key={i}><ImagePlus />{f.name}<button onClick={() => setFiles(fs => fs.filter((_, idx) => idx !== i))}><X /></button></p>)}
            <section>
              <button onClick={() => fileInput.current?.click()}><ImagePlus /></button>
              <button onClick={() => setEmojiOpen(o => !o)}><SmilePlus /></button>
              {emojiOpen && <span className="emoji-popup">{emojis.map(e => <button key={e} onClick={() => { setDraft(d => d + e); setEmojiOpen(false); }}>{e}</button>)}</span>}
              <textarea value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder={`Message #${activity}`} />
              <button onClick={() => fileInput.current?.click()}><Camera /></button>
              <button className="send" disabled={busy || (!draft.trim() && !files.length)} onClick={send}>{busy ? <LoaderCircle className="spin" /> : <Send />}</button>
              <input ref={fileInput} hidden multiple type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={e => {
                const picked = Array.from(e.target.files ?? []);
                const room = Math.max(0, maxImages - files.length);
                const oversized = picked.some(f => f.size > 8388608);
                if (picked.length > room) setError(`You can attach up to ${maxImages} images per message.`);
                else if (oversized) setError("Each image must be 8 MB or smaller.");
                setFiles(fs => [...fs, ...picked.filter(f => f.size <= 8388608)].slice(0, maxImages));
                e.target.value = "";
              }} />
            </section>
            <small>Enter to send · Shift + Enter for a new line · Up to {maxImages} images, 8 MB each</small>
          </>}
        </div>
      </section>
    </div>
    <BottomNav active="community" />
  </main>;
}
