import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseKey,supabaseUrl } from "@/lib/supabase/config";
export async function GET(request:Request){const url=new URL(request.url),code=url.searchParams.get("code"),next=url.searchParams.get("next")?.startsWith("/")?url.searchParams.get("next")!:"/",response=NextResponse.redirect(new URL(next,url.origin)),cookieStore=await cookies();if(!code||!supabaseUrl||!supabaseKey)return NextResponse.redirect(new URL("/login?error=configuration",url.origin));const client=createServerClient(supabaseUrl,supabaseKey,{cookies:{getAll:()=>cookieStore.getAll(),setAll:items=>items.forEach(({name,value,options})=>response.cookies.set(name,value,options))}});const{error}=await client.auth.exchangeCodeForSession(code);return error?NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`,url.origin)):response}
