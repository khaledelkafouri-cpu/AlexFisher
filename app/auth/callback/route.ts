import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {createServerClient} from '@supabase/ssr';
import {supabaseKey,supabaseUrl} from '@/lib/supabase/config';
import {safeNext} from '@/lib/auth-navigation';
export async function GET(request:Request){
 const url=new URL(request.url),code=url.searchParams.get('code'),next=safeNext(url.searchParams.get('next'));
 const failure=()=>NextResponse.redirect(new URL('/login?mode=signin&error=recovery_link',url.origin));
 if(!code||!supabaseUrl||!supabaseKey)return failure();
 const response=NextResponse.redirect(new URL(next,url.origin)),cookieStore=await cookies();
 const client=createServerClient(supabaseUrl,supabaseKey,{cookies:{getAll:()=>cookieStore.getAll(),setAll:items=>items.forEach(({name,value,options})=>response.cookies.set(name,value,options))}});
 try{const {error}=await client.auth.exchangeCodeForSession(code);return error?failure():response}catch{return failure()}
}
