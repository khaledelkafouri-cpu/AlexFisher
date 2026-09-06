"use client";

import Link from 'next/link';
import {useEffect,useMemo,useRef,useState} from 'react';
import {ArrowLeft,UserRound,ShieldCheck,Mail,Settings,LogOut,Download,LoaderCircle} from 'lucide-react';
import {createSupabaseClient} from '@/lib/supabase/client';
import {activityIds,cleanProfile,passwordIssue,type ProfileSettings} from '@/lib/account-settings';
import BottomNav from '@/components/BottomNav';
import './account.css';

type Section='profile'|'emails'|'password'|'sessions'|'language'|'export';
type Notice={ok:boolean;text:string};
type Member={id:string;email:string;verified:boolean;role:string;joined:string;plan:string;status:string};
const empty:ProfileSettings={display_name:'',country:'',city:'',interests:[]};

export default function Account(){
  const db=useMemo(()=>createSupabaseClient(),[]);
  const [member,setMember]=useState<Member|null>(null),[profile,setProfile]=useState<ProfileSettings>(empty),[savedProfile,setSavedProfile]=useState<ProfileSettings>(empty);
  const [marketing,setMarketing]=useState(false),[savedMarketing,setSavedMarketing]=useState(false);
  const [loading,setLoading]=useState(true),[loadError,setLoadError]=useState(''),[retry,setRetry]=useState(0);
  const [pending,setPending]=useState<Section|null>(null),[notices,setNotices]=useState<Partial<Record<Section,Notice>>>({});
  const [password,setPassword]=useState(''),[confirmation,setConfirmation]=useState(''),[nonce,setNonce]=useState(''),[showPassword,setShowPassword]=useState(false);
  const [language,setLanguage]=useState<'en'|'ar'>('en');
  const leaving=useRef(false),running=useRef(false);
  const rtl=language==='ar',t=(en:string,ar:string)=>rtl?ar:en;
  const profileDirty=JSON.stringify(profile)!==JSON.stringify(savedProfile),emailDirty=marketing!==savedMarketing;
  const dirty=profileDirty||emailDirty||!!password||!!confirmation;

  useEffect(()=>{
    // Restore the existing browser preference after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if(localStorage.getItem('alexfisher-language')==='ar')setLanguage('ar');
  },[]);
  useEffect(()=>{
    let active=true;
    async function load(){
      try{
        if(!db)throw new Error('Settings are unavailable. Please try again later.');
        const {data,error}=await db.auth.getUser();if(error||!data.user)throw new Error('Please sign in again to open your settings.');
        const user=data.user;
        const [p,c]=await Promise.all([
          db.from('profiles').select('display_name,country,city,interests,role').eq('id',user.id).single(),
          db.from('audience_contacts').select('plan,subscription_status,marketing_consent').eq('user_id',user.id).single(),
        ]);
        if(p.error||c.error||!p.data||!c.data)throw new Error('Your settings could not be loaded. Nothing has been changed.');
        if(!active)return;
        const value={display_name:p.data.display_name??'',country:p.data.country??'',city:p.data.city??'',interests:p.data.interests??[]};
        setProfile(value);setSavedProfile(value);setMarketing(c.data.marketing_consent);setSavedMarketing(c.data.marketing_consent);
        setMember({id:user.id,email:user.email??'',verified:!!user.email_confirmed_at,role:p.data.role,joined:user.created_at,plan:c.data.plan,status:c.data.subscription_status});
        setLoadError('');
      }catch(error){if(active)setLoadError(error instanceof Error?error.message:'Unable to load settings.')}
      finally{if(active)setLoading(false)}
    }
    void load();return()=>{active=false};
  },[db,retry]);
  useEffect(()=>{
    if(!dirty)return;
    const warn=(event:BeforeUnloadEvent)=>{if(!leaving.current){event.preventDefault();event.returnValue=''}};
    window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);
  },[dirty]);
  const notify=(section:Section,ok:boolean,text:string)=>setNotices(current=>({...current,[section]:{ok,text}}));
  async function run(section:Section,work:()=>Promise<void>){
    if(running.current||!db||!member)return;
    running.current=true;setPending(section);setNotices(current=>({...current,[section]:undefined}));
    try{await work()}catch(error){notify(section,false,error instanceof Error?error.message:t('Could not save. Try again.','تعذر الحفظ. حاول مرة أخرى.'))}
    finally{running.current=false;setPending(null)}
  }
  const feedback=(section:Section)=>notices[section]&&<p className={notices[section]!.ok?'settings-success':'settings-error'} role={notices[section]!.ok?'status':'alert'}>{notices[section]!.text}</p>;
  const saveButton=(section:Section,changed=true)=><button className="settings-primary" type="submit" disabled={!!pending||!changed}>{pending===section?<><LoaderCircle size={18} className="spin"/>{t('Saving…','جارٍ الحفظ…')}</>:t('Save changes','حفظ التغييرات')}</button>;
  const update=(values:Partial<ProfileSettings>)=>{setProfile(current=>({...current,...values}));setNotices(current=>({...current,profile:undefined}))};

  return <main className="settings-page" dir={rtl?'rtl':'ltr'}>
    <header className="settings-top"><Link href="/"><ArrowLeft size={18}/>{t('Back to the sea','العودة للموقع')}</Link><span>ALEX<strong>FISHER</strong></span></header>
    <div className="settings-wrap"><header className="settings-heading"><span className="settings-kicker">{t('YOUR ALEXFISHER ACCOUNT','حسابك في أليكس فيشر')}</span><h1>{t('Profile & settings','الملف الشخصي والإعدادات')}</h1><p>{t('Your details, your preferences, your control.','بياناتك وتفضيلاتك تحت تحكمك.')}</p></header>
      {loading?<p role="status"><LoaderCircle className="spin"/>{t('Loading your settings…','جارٍ تحميل إعداداتك…')}</p>:loadError?<section className="settings-card"><h2>{t('Unable to open settings','تعذر فتح الإعدادات')}</h2><p role="alert">{rtl?'تعذر تحميل بيانات الحساب. تأكد من تسجيل الدخول وحاول مرة أخرى. لم يتم تغيير أي بيانات.':loadError}</p><button onClick={()=>{setLoading(true);setRetry(value=>value+1)}}>{t('Try again','حاول مرة أخرى')}</button><Link href="/login?next=/account">{t('Sign in','تسجيل الدخول')}</Link></section>:member&&<>
        <nav className="settings-sections" aria-label={t('Account sections','أقسام الحساب')}>{[['profile',t('Profile','الملف الشخصي')],['preferences',t('Preferences','التفضيلات')],['security',t('Security','الأمان')],['membership',t('Membership','العضوية')]].map(([id,label])=><a key={id} href={`#settings-${id}`}>{label}</a>)}</nav>
        <div className="settings-layout"><aside className="settings-summary"><i aria-hidden="true">{savedProfile.display_name.trim().slice(0,2).toUpperCase()||'AF'}</i><h2>{savedProfile.display_name}</h2><p>{member.email}</p><span>{member.verified?t('Email verified','البريد مؤكد'):t('Email not verified','البريد غير مؤكد')}</span><small>{t('Member since','عضو منذ')} {new Date(member.joined).toLocaleDateString(rtl?'ar-EG':'en-GB',{month:'long',year:'numeric'})}</small>{dirty&&<p className="settings-dirty" role="status">{t('You have unsaved changes.','لديك تغييرات لم تُحفظ.')}</p>}{member.role==='admin'&&<Link href="/admin">{t('Administrator dashboard','لوحة تحكم المدير')} →</Link>}</aside>
          <div className="settings-panels">
            <section id="settings-profile" className="settings-card"><h2><UserRound/>{t('Your profile','ملفك الشخصي')}</h2><p>{t('Your display name appears beside your posts and questions. Optional location and interests may be visible to signed-in members. Do not add a home address.','اسمك يظهر بجانب منشوراتك وأسئلتك. قد تظهر المنطقة والاهتمامات الاختيارية للأعضاء المسجلين. لا تضف عنوان منزلك.')}</p>
              <form onSubmit={event=>{event.preventDefault();void run('profile',async()=>{
                let cleaned;try{cleaned=cleanProfile(profile)}catch{throw new Error(t('Enter a name of 1–60 characters and a country/city of up to 80 characters.','أدخل اسماً من 1 إلى 60 حرفاً، وبلداً ومدينة لا يتجاوز كل منهما 80 حرفاً.'))}
                const {data,error}=await db!.from('profiles').update({...cleaned,updated_at:new Date().toISOString()}).eq('id',member.id).select('display_name,country,city,interests').single();
                if(error||!data)throw new Error(t('Profile was not saved. Please try again.','لم يُحفظ الملف. حاول مرة أخرى.'));
                const value={...data,country:data.country??'',city:data.city??''} as ProfileSettings;setProfile(value);setSavedProfile(value);notify('profile',true,t('Profile saved.','تم حفظ الملف الشخصي.'));
              })}}><fieldset disabled={pending==='profile'}><label>{t('Display name','الاسم الظاهر')}<input value={profile.display_name} onChange={event=>update({display_name:event.target.value})} maxLength={60} required autoComplete="nickname"/></label><div className="settings-pair"><label>{t('Country / region (optional)','البلد / المنطقة (اختياري)')}<input value={profile.country} onChange={event=>update({country:event.target.value})} maxLength={80} autoComplete="country-name"/></label><label>{t('City (optional)','المدينة (اختياري)')}<input value={profile.city} onChange={event=>update({city:event.target.value})} maxLength={80} autoComplete="address-level2"/></label></div><fieldset className="settings-interests"><legend>{t('Your activities','أنشطتك')}</legend>{activityIds.map((id,index)=><label key={id}><input type="checkbox" checked={profile.interests.includes(id)} onChange={event=>update({interests:event.target.checked?[...profile.interests,id]:profile.interests.filter(value=>value!==id)})}/>{[t('Fishing','صيد السمك'),t('Surfing','ركوب الأمواج'),t('Kayaking','الكاياك')][index]}</label>)}</fieldset></fieldset><div className="settings-actions">{saveButton('profile',profileDirty)}<button type="button" disabled={!!pending||!profileDirty} onClick={()=>{setProfile(savedProfile);setNotices(current=>({...current,profile:undefined}))}}>{t('Discard changes','إلغاء التغييرات')}</button></div>{feedback('profile')}</form>
            </section>
            <section id="settings-preferences" className="settings-card"><h2><Settings/>{t('Language & preferences','اللغة والتفضيلات')}</h2><label>{t('Website language on this device','لغة الموقع على هذا الجهاز')}<select value={language} onChange={event=>{const next=event.target.value as 'en'|'ar';try{localStorage.setItem('alexfisher-language',next);setLanguage(next);setNotices({});notify('language',true,next==='ar'?'تم حفظ اللغة على هذا الجهاز.':'Language saved on this device.')}catch{notify('language',false,t('Your browser could not save this preference.','تعذر حفظ اللغة في المتصفح.'))}}}><option value="en">English</option><option value="ar">العربية</option></select></label><p>{t('Saved in this browser. Other pages use this choice when you next open them.','تُحفظ في هذا المتصفح. تستخدم الصفحات الأخرى اختيارك عند فتحها مرة أخرى.')}</p>{feedback('language')}</section>
            <section className="settings-card"><h2><Mail/>{t('Email preferences','تفضيلات البريد')}</h2><form onSubmit={event=>{event.preventDefault();void run('emails',async()=>{
              const {data,error}=await db!.from('audience_contacts').update({marketing_consent:marketing,marketing_consent_at:marketing?new Date().toISOString():null,updated_at:new Date().toISOString()}).eq('user_id',member.id).select('marketing_consent').single();
              if(error||!data)throw new Error(t('Email preference was not saved.','لم يُحفظ تفضيل البريد.'));
              setSavedMarketing(data.marketing_consent);notify('emails',true,t('Email preference saved.','تم حفظ تفضيل البريد.'));
            })}}><label className="settings-check"><input type="checkbox" checked={marketing} disabled={pending==='emails'} onChange={event=>{setMarketing(event.target.checked);setNotices(current=>({...current,emails:undefined}))}}/><span><strong>{t('Send me fishing tips, news and offers','أرسل لي نصائح الصيد والأخبار والعروض')}</strong><small>{t('Optional. Turn this off and save to stop future marketing emails.','اختياري. ألغِ التحديد واحفظ لإيقاف رسائل التسويق القادمة.')}</small></span></label><p>{t('Account security and essential service messages are separate from marketing.','رسائل أمان الحساب والخدمة الأساسية منفصلة عن التسويق.')}</p>{saveButton('emails',emailDirty)}{feedback('emails')}</form></section>
            <section id="settings-security" className="settings-card"><h2><ShieldCheck/>{t('Password & security','كلمة المرور والأمان')}</h2><label>{t('Sign-in email','بريد تسجيل الدخول')}<input value={member.email} readOnly type="email" autoComplete="email"/></label><p>{t('Your sign-in email is shown for reference. Password changes are saved separately from your profile.','بريد الدخول ظاهر للاطلاع. تُحفظ كلمة المرور بشكل منفصل عن الملف الشخصي.')}</p><form onSubmit={event=>{event.preventDefault();void run('password',async()=>{
              const issue=passwordIssue(password,confirmation);if(issue)throw new Error(issue==='length'?t('Use a password between 12 and 128 characters.','استخدم كلمة مرور من 12 إلى 128 حرفاً.'):t('The passwords do not match.','كلمتا المرور غير متطابقتين.'));
              const {error}=await db!.auth.updateUser({password,...(nonce.trim()?{nonce:nonce.trim()}:{})});if(error)throw error;
              setPassword('');setConfirmation('');setNonce('');notify('password',true,t('Password updated. You can also sign out other devices below.','تم تحديث كلمة المرور. يمكنك أيضاً تسجيل خروج الأجهزة الأخرى أدناه.'));
            })}}><fieldset disabled={pending==='password'}><div className="settings-pair"><label>{t('New password','كلمة المرور الجديدة')}<input type={showPassword?'text':'password'} autoComplete="new-password" minLength={12} maxLength={128} value={password} required onChange={event=>{setPassword(event.target.value);setNotices(current=>({...current,password:undefined}))}}/></label><label>{t('Confirm password','تأكيد كلمة المرور')}<input type={showPassword?'text':'password'} autoComplete="new-password" minLength={12} maxLength={128} value={confirmation} required onChange={event=>{setConfirmation(event.target.value);setNotices(current=>({...current,password:undefined}))}}/></label></div><label className="settings-check"><input type="checkbox" checked={showPassword} onChange={event=>setShowPassword(event.target.checked)}/>{t('Show passwords','إظهار كلمة المرور')}</label><p>{t('Use at least 12 characters. A long, unique passphrase works well.','استخدم 12 حرفاً على الأقل. اختر عبارة طويلة وفريدة لا تستخدمها في مكان آخر.')}</p><details><summary>{t('Asked for a security code?','طُلب منك رمز أمان؟')}</summary><p>{t('Request a code, then enter it here and save your password again.','اطلب رمزاً ثم أدخله هنا وأعد حفظ كلمة المرور.')}</p><button type="button" disabled={!!pending} onClick={()=>void run('password',async()=>{const {error}=await db!.auth.reauthenticate();if(error)throw error;notify('password',true,t('Check your verified email or phone for the security code.','راجع البريد أو الهاتف المؤكد للحصول على رمز الأمان.'))})}>{t('Send security code','إرسال رمز الأمان')}</button><label>{t('Security code','رمز الأمان')}<input value={nonce} onChange={event=>setNonce(event.target.value)} autoComplete="one-time-code" maxLength={20}/></label></details></fieldset>{saveButton('password',!!password&&!!confirmation)}{feedback('password')}</form></section>
            <section className="settings-card"><h2><LogOut/>{t('Signed-in devices','الأجهزة المسجلة')}</h2><p>{t('Sign out of this browser or end sessions on other devices. Other sessions may remain usable until their current access token expires.','سجّل الخروج من هذا المتصفح أو أنهِ جلسات الأجهزة الأخرى. قد تظل الجلسات الأخرى صالحة حتى انتهاء رمز الوصول الحالي.')}</p><div className="settings-actions">{(['local','others'] as const).map(scope=><button key={scope} disabled={!!pending} onClick={()=>{
              if(!window.confirm(scope==='local'?t('Sign out of this browser? Unsaved changes will be lost.','تسجيل الخروج من هذا المتصفح؟ ستفقد التغييرات غير المحفوظة.'):t('Sign out of your other devices? You will stay signed in here.','تسجيل خروج الأجهزة الأخرى؟ ستظل مسجلاً هنا.')))return;
              void run('sessions',async()=>{const {error}=await db!.auth.signOut({scope});if(error)throw error;if(scope==='local'){leaving.current=true;window.location.assign('/login')}else notify('sessions',true,t('Other sessions have been signed out.','تم إنهاء الجلسات الأخرى.'))});
            }}>{scope==='local'?t('Sign out here','تسجيل الخروج هنا'):t('Sign out other devices','تسجيل خروج الأجهزة الأخرى')}</button>)}</div>{feedback('sessions')}</section>
            <section id="settings-membership" className="settings-card"><h2>{t('Membership & privacy','العضوية والخصوصية')}</h2><dl className="settings-membership"><div><dt>{t('Plan','الخطة')}</dt><dd>{member.plan==='free'?t('Free','مجانية'):member.plan}</dd></div><div><dt>{t('Status','الحالة')}</dt><dd>{({active:t('Active','نشطة'),trialing:t('Trial','تجريبية'),past_due:t('Payment overdue','الدفع متأخر'),cancelled:t('Cancelled','ملغاة'),expired:t('Expired','منتهية')} as Record<string,string>)[member.status]??member.status}</dd></div></dl><p>{t('Plan and billing changes are not available here. Viewing this page or saving your profile does not purchase or renew a subscription.','تغيير الخطة والفوترة غير متاح هنا. فتح الصفحة أو حفظ ملفك لا يشتري أو يجدد أي اشتراك.')}</p><div className="settings-actions"><button disabled={!!pending} onClick={()=>void run('export',async()=>{
              const blob=new Blob([JSON.stringify({exported_at:new Date().toISOString(),email:member.email,profile:savedProfile,membership:{plan:member.plan,status:member.status,joined:member.joined},marketing_consent:savedMarketing},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='alexfisher-profile.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('export',true,t('Profile download started. This contains your saved settings, not community posts or course history.','بدأ تنزيل الملف. يحتوي على إعداداتك المحفوظة، وليس منشورات المجتمع أو سجل الدروس.'));
            })}><Download size={18}/>{t('Download my profile','تنزيل ملفي الشخصي')}</button><Link href="/privacy">{t('Privacy notice','بيان الخصوصية')}</Link></div>{feedback('export')}</section>
          </div>
        </div>
      </>}
    </div><BottomNav key={language} active="account"/>
  </main>;
}
