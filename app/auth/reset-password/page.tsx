"use client";
import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import {createSupabaseClient} from '@/lib/supabase/client';
import {passwordIssue} from '@/lib/account-settings';

export default function ResetPassword(){
  const db=useMemo(()=>createSupabaseClient(),[]);
  const [ready,setReady]=useState(false),[busy,setBusy]=useState(false),[done,setDone]=useState(false);
  const [password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[message,setMessage]=useState('Checking your reset link…');
  useEffect(()=>{let active=true;async function check(){
    if(!db){setMessage('Password recovery is unavailable. Please try again later.');return}
    try{const {data,error}=await db.auth.getUser();if(!active)return;if(error||!data.user){setMessage('This link has expired or is invalid. Request a new reset email and open it in the same browser.');return}setReady(true);setMessage('Choose a new password with 12–128 characters.');}catch{if(active)setMessage('Unable to verify the link. Please try again.');}
  }void check();return()=>{active=false}},[db]);
  return <main className="login-page" style={{display:'grid',placeItems:'center',minHeight:'100dvh',padding:20}}><section className="login-card" style={{width:'100%',maxWidth:520}}><h2>{done?'Password updated':'Reset your password'}</h2><p role="status">{message}</p>{ready&&!done&&<form onSubmit={async event=>{event.preventDefault();if(busy||!db)return;const issue=passwordIssue(password,confirm);if(issue){setMessage(issue==='length'?'Use 12–128 characters.':'The passwords do not match.');return}setBusy(true);try{const {error}=await db.auth.updateUser({password});if(error)throw error;setPassword('');setConfirm('');setDone(true);setMessage('Your new password is saved. You can now return to your account.');}catch(error){setMessage(error instanceof Error?error.message:'Password could not be saved. Try again.')}finally{setBusy(false)}}}><label>New password<input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={password} onChange={e=>setPassword(e.target.value)}/></label><label>Confirm new password<input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={confirm} onChange={e=>setConfirm(e.target.value)}/></label><button className="login-submit" disabled={busy}>{busy?'Saving…':'Save new password'}</button></form>}<Link href={done?'/account':'/login?mode=signin'}>{done?'Continue to my account':'Back to sign in / request a new link'}</Link></section></main>;
}
