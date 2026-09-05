"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Anchor, LoaderCircle } from "lucide-react";
import { createSupabaseClient } from "@/lib/supabase/client";
const publicPaths = new Set(["/login", "/privacy"]);
export default function MembershipGate({ children }: { children: React.ReactNode }) {
  const path = usePathname(), supabase = useMemo(createSupabaseClient, []);
  const [user,setUser]=useState<User|null>(null),[loading,setLoading]=useState(Boolean(supabase));
  useEffect(()=>{if(!supabase)return;supabase.auth.getUser().then(({data})=>{setUser(data.user);setLoading(false)});const{data}=supabase.auth.onAuthStateChange((_e,s)=>{setUser(s?.user??null);setLoading(false)});return()=>data.subscription.unsubscribe()},[supabase]);
  if(publicPaths.has(path)||path.startsWith("/auth/"))return children;
  if(loading)return <><div className="member-content locked">{children}</div><main className="member-loading"><LoaderCircle className="spin"/>Preparing your membership…</main></>;
  if(!user)return <><div className="member-content locked">{children}</div><main className="member-wall"><section><i><Anchor/></i><p>FREE ALEXFISHER MEMBERSHIP</p><h1>Know the sea.<br/><em>Join the crew.</em></h1><span>Create your free account to use forecasts, planning tools, learning resources and the community.</span><Link href={`/login?next=${encodeURIComponent(path)}`}>Continue with email</Link><small>Free today. You will always approve any future paid plan before being charged.</small></section></main></>;
  return <>{children}</>;
}
