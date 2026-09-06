"use client";

import {useCallback,useEffect,useRef,useState} from "react";
import {MessageCircle,RefreshCw,Send} from "lucide-react";
import {createSupabaseClient} from "@/lib/supabase/client";

type Entry={id:string;body:string;author:string;created_at:string};
async function discussionRequest(path:string,options:RequestInit={}){
  const db=createSupabaseClient(),session=await db?.auth.getSession(),token=session?.data.session?.access_token;
  if(!token)throw new Error("Please sign in to use Q&A.");
  const response=await fetch(`/api/learning/questions${path}`,{...options,cache:"no-store",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`}});
  const data=await response.json();if(!response.ok)throw new Error(data.error??"Unable to load the discussion.");return data;
}

export function LessonQuestions({lessonId,title,rtl}:{lessonId:string;title:string;rtl:boolean}){
  return <section className="lesson-qa" aria-label="Q&A"><header><h3>{rtl?"أسئلة وأجوبة":"Q&A"}</h3><p>{rtl?"اسأل أو شارك تعليقاً حول هذا الدرس.":"Ask a question or share a comment about this lesson."}</p><small>{title}</small></header><DiscussionList key={lessonId} lessonId={lessonId} rtl={rtl}/></section>;
}

function DiscussionList({lessonId,questionId,rtl}:{lessonId:string;questionId?:string;rtl:boolean}){
  const [items,setItems]=useState<Entry[]>([]),[hasMore,setHasMore]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState(""),[version,setVersion]=useState(0);
  const generation=useRef(0);
  const path=`?lesson_id=${encodeURIComponent(lessonId)}${questionId?`&question_id=${encodeURIComponent(questionId)}`:""}`;
  const load=useCallback(async(offset:number,signal?:AbortSignal)=>{
    const request=++generation.current;
    try{const data=await discussionRequest(`${path}&offset=${offset}`,{signal});if(request!==generation.current||signal?.aborted)return;setItems(previous=>offset?[...previous,...data.items.filter((entry:Entry)=>!previous.some(item=>item.id===entry.id))]:data.items);setHasMore(data.hasMore)}
    catch(cause){if(request===generation.current&&!signal?.aborted)setError(cause instanceof Error?cause.message:"Unable to load Q&A.")}
    finally{if(request===generation.current&&!signal?.aborted)setLoading(false)}
  },[path]);
  // Loading synchronizes this discussion with the API; state updates occur after the request settles.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{const controller=new AbortController();void load(0,controller.signal);return()=>controller.abort()},[load,version]);
  const refresh=()=>{setLoading(true);setError("");setVersion(value=>value+1)};
  return <div className={questionId?"qa-replies":"qa-questions"}>
    {!questionId&&<QuestionComposer lessonId={lessonId} rtl={rtl} onSaved={refresh}/>}
    <div className="qa-list-tools"><b>{questionId?(rtl?"الردود":"Replies"):(rtl?"الأسئلة والتعليقات":"Questions & comments")}</b><button aria-label={rtl?"تحديث النقاش":"Refresh discussion"} disabled={loading} onClick={refresh}><RefreshCw/></button></div>
    {error&&<p className="qa-error" role="alert">{error}</p>}
    {loading&&<p className="qa-status" role="status">{rtl?"جارٍ التحميل…":"Loading discussion…"}</p>}
    {!loading&&!error&&!items.length&&<p className="qa-status">{questionId?(rtl?"كن أول من يرد.":"Be the first to reply."):(rtl?"لا توجد أسئلة بعد. ابدأ النقاش.":"No questions yet. Start the conversation.")}</p>}
    {items.map(item=><QuestionEntry key={item.id} entry={item} lessonId={lessonId} reply={!!questionId} rtl={rtl}/>)}
    {hasMore&&<button className="qa-more" disabled={loading} onClick={()=>{setLoading(true);setError("");void load(items.length)}}>{rtl?"عرض المزيد":"Load more"}</button>}
    {questionId&&<QuestionComposer lessonId={lessonId} questionId={questionId} rtl={rtl} onSaved={refresh}/>}
  </div>;
}

function QuestionEntry({entry,lessonId,reply,rtl}:{entry:Entry;lessonId:string;reply:boolean;rtl:boolean}){
  const [open,setOpen]=useState(false);
  return <article className="qa-entry"><header><b>{entry.author}</b><time dateTime={entry.created_at}>{new Date(entry.created_at).toLocaleString(rtl?"ar-EG":"en-GB",{dateStyle:"medium",timeStyle:"short"})}</time></header><p>{entry.body}</p>{!reply&&<><button className="qa-reply-toggle" aria-expanded={open} onClick={()=>setOpen(value=>!value)}><MessageCircle/>{rtl?"التعليقات والردود":"Comments & replies"}</button>{open&&<DiscussionList lessonId={lessonId} questionId={entry.id} rtl={rtl}/>}</>}</article>;
}

function QuestionComposer({lessonId,questionId,rtl,onSaved}:{lessonId:string;questionId?:string;rtl:boolean;onSaved:()=>void}){
  const [body,setBody]=useState(""),[saving,setSaving]=useState(false),[error,setError]=useState(""),[saved,setSaved]=useState(false);
  return <form className="qa-composer" onSubmit={async event=>{event.preventDefault();if(saving||!body.trim())return;setSaving(true);setError("");setSaved(false);try{await discussionRequest("",{method:"POST",body:JSON.stringify({lesson_id:lessonId,question_id:questionId,body:body.trim()})});setBody("");setSaved(true);onSaved()}catch(cause){setError(cause instanceof Error?cause.message:"Unable to post.")}finally{setSaving(false)}}}>
    <label><span>{questionId?(rtl?"اكتب رداً":"Write a reply"):(rtl?"سؤالك أو تعليقك":"Your question or comment")}</span><textarea value={body} onChange={event=>{setBody(event.target.value);setSaved(false)}} maxLength={4000} required disabled={saving} rows={3}/></label>
    <div><small>{body.length}/4000</small><button disabled={saving||!body.trim()} type="submit"><Send/>{saving?(rtl?"جارٍ النشر…":"Posting…"):questionId?(rtl?"نشر الرد":"Post reply"):(rtl?"نشر السؤال":"Post question")}</button></div>
    {error&&<p className="qa-error" role="alert">{error}</p>}{saved&&<p className="qa-status" role="status">{rtl?"تم نشر رسالتك.":"Your message has been posted."}</p>}
  </form>;
}
