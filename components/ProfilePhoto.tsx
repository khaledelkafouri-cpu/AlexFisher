"use client";
import {useMemo,useState} from 'react';
import {createSupabaseClient} from '@/lib/supabase/client';

export default function ProfilePhoto({userId,initialUrl,rtl,onSaved}:{userId:string;initialUrl:string|null;rtl:boolean;onSaved:(url:string|null)=>void}){
 const db=useMemo(()=>createSupabaseClient(),[]),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const t=(en:string,ar:string)=>rtl?ar:en;
 async function save(file:File|null){
  if(busy||!db)return;setBusy(true);setMessage('');let path:string|null=null;
  try{
   let url:string|null=null;
   if(file){
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>2097152||!file.size)throw new Error(t('Choose a JPG, PNG or WebP photo up to 2 MB.','اختر صورة JPG أو PNG أو WebP بحجم حتى ٢ ميجابايت.'));
    // Decode and re-encode to verify an actual image, resize, and strip metadata.
    const bitmap=await createImageBitmap(file);
    const canvas=document.createElement('canvas'),scale=Math.min(1,512/Math.max(bitmap.width,bitmap.height));canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
    const context=canvas.getContext('2d');if(!context){bitmap.close();throw new Error('Unable to process photo.')}
    context.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
    const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('Unable to process photo.')),'image/webp',0.85));
    path=`${userId}/${crypto.randomUUID()}.webp`;
    const {error}=await db.storage.from('profile-avatars').upload(path,blob,{contentType:'image/webp',upsert:false});if(error)throw error;
    url=db.storage.from('profile-avatars').getPublicUrl(path).data.publicUrl;
   }
   const {data,error}=await db.from('profiles').update({avatar_url:url,updated_at:new Date().toISOString()}).eq('id',userId).select('avatar_url').single();if(error||!data)throw error??new Error('Photo was not saved.');
   const old=initialUrl;onSaved(data.avatar_url);path=null;
   setMessage(t('Profile photo saved.','تم حفظ صورة الملف الشخصي.'));
   // Only clean up images belonging to this user's dedicated avatar folder.
   const prefix=db.storage.from('profile-avatars').getPublicUrl(`${userId}/`).data.publicUrl;
   if(old?.startsWith(prefix)){const name=old.slice(prefix.length);if(/^[\w-]+\.webp$/.test(name)){const {error:cleanup}=await db.storage.from('profile-avatars').remove([`${userId}/${name}`]);if(cleanup)setMessage(t('Photo saved, but the old file could not be removed.','تم الحفظ، لكن تعذر حذف ملف الصورة القديمة.'));}}
  }catch(error){if(path)await db.storage.from('profile-avatars').remove([path]);setMessage(error instanceof Error?error.message:t('Photo could not be saved.','تعذر حفظ الصورة.'));}
  finally{setBusy(false)}
 }
 return <div className="settings-photo"><p>{t('Your photo is public. JPG, PNG or WebP, up to 2 MB.','صورتك عامة. JPG أو PNG أو WebP، بحجم حتى ٢ ميجابايت.')}</p><label>{busy?t('Saving…','جارٍ الحفظ…'):t('Upload / change photo','رفع / تغيير الصورة')}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={event=>{const file=event.target.files?.[0];event.target.value='';if(file)void save(file)}}/></label>{initialUrl&&<button type="button" disabled={busy} onClick={()=>void save(null)}>{t('Remove photo','حذف الصورة')}</button>}{message&&<p role="status">{message}</p>}</div>;
}
