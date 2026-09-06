"use client";

import {useState, useSyncExternalStore} from "react";
import {Dialog, Popover} from "radix-ui";
import {CheckCircle2, ChevronDown, FileText, PlayCircle, Trophy, X} from "lucide-react";

type Lesson = {id:string; en:string; ar:string; minutes:number; resources?:{id:string;title:string;url?:string}[]};
type Course = {id:string; en:string; ar:string; sections:{en:string;ar:string;lessons:Lesson[]}[]};
type Props = {courses:Course[]; selected:string; activeLesson:string; completed:string[]; pending:string[]; rtl:boolean; open:boolean; onOpenChange:(open:boolean)=>void; desktopOpen:boolean; onDesktopOpenChange:(open:boolean)=>void; onChoose:(courseId:string,lessonId:string)=>void; onComplete:(id:string)=>void};

function subscribe(callback:()=>void){const media=window.matchMedia("(max-width: 900px)");media.addEventListener("change",callback);return()=>media.removeEventListener("change",callback)}
function mobileSnapshot(){return window.matchMedia("(max-width: 900px)").matches}
const serverSnapshot=()=>false;

export function CourseNavigation(props:Props){
  const mobile=useSyncExternalStore(subscribe,mobileSnapshot,serverSnapshot);
  const content=<Curriculum {...props} onOpenChange={mobile?props.onOpenChange:props.onDesktopOpenChange}/>;
  if(!mobile)return props.desktopOpen?<aside className="classroom-sidebar" aria-label={props.rtl?"محتوى الكورسات":"Course content"}>{content}</aside>:null;
  return <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}><Dialog.Portal><Dialog.Overlay className="classroom-drawer-overlay"/><Dialog.Content className="classroom-drawer" dir={props.rtl?"rtl":"ltr"} aria-describedby={undefined}><Dialog.Title className="classroom-sr-only">{props.rtl?"محتوى الكورسات":"Course content"}</Dialog.Title>{content}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}

function Curriculum({courses,selected,activeLesson,completed,pending,rtl,onOpenChange,onChoose,onComplete}:Props){
  const [expanded,setExpanded]=useState<Record<string,boolean>>({});
  const recommended=courses.find(course=>course.sections.some(section=>section.lessons.some(lesson=>!completed.includes(lesson.id))))?.id;
  return <><header className="classroom-sidebar-header"><h2>{rtl?"محتوى الكورسات":"Course content"}</h2><button onClick={()=>onOpenChange(false)} aria-label={rtl?"إغلاق القائمة":"Close course content"}><X/></button></header>
    <nav className="classroom-course-tree" aria-label={rtl?"الكورسات والأقسام والدروس":"Courses, sections and lessons"}>
      {courses.map((course,courseIndex)=>{
        const lessons=course.sections.flatMap(section=>section.lessons),done=lessons.filter(lesson=>completed.includes(lesson.id)).length;
        const isOpen=expanded[course.id]??course.id===selected;
        return <section className="classroom-tree-course" key={course.id}>
          <button className="classroom-tree-heading" aria-expanded={isOpen} onClick={()=>setExpanded(items=>({...items,[course.id]:!isOpen}))}>
            <span><b>{courseIndex+1}. {rtl?course.ar:course.en}</b><small>{done} / {lessons.length} · {lessons.reduce((sum,lesson)=>sum+lesson.minutes,0)} {rtl?"دقيقة":"min"}</small>
              {lessons.length>0&&done===lessons.length?<em><CheckCircle2/>{rtl?"مكتمل":"Completed"}</em>:course.id===recommended?<em>{rtl?"موصى به للمتابعة":"Recommended next"}</em>:null}
            </span><ChevronDown className={isOpen?"expanded":""}/>
          </button>
          {isOpen&&course.sections.map((section,index)=>{
            const key=`${course.id}:${index}`,sectionOpen=expanded[key]??section.lessons.some(lesson=>lesson.id===activeLesson),sectionDone=section.lessons.filter(lesson=>completed.includes(lesson.id)).length;
            return <section key={key} className="classroom-tree-section"><button className="classroom-section-heading" aria-expanded={sectionOpen} onClick={()=>setExpanded(items=>({...items,[key]:!sectionOpen}))}><span><b>{rtl?"القسم":"Section"} {index+1}: {rtl?section.ar:section.en}</b><small>{sectionDone} / {section.lessons.length} · {section.lessons.reduce((sum,lesson)=>sum+lesson.minutes,0)} {rtl?"دقيقة":"min"}</small></span><ChevronDown className={sectionOpen?"expanded":""}/></button>
              {sectionOpen&&(section.lessons.length?section.lessons.map(lesson=><article className={`classroom-tree-lesson ${activeLesson===lesson.id?"active":""}`} key={lesson.id}>
                <input type="checkbox" checked={completed.includes(lesson.id)} disabled={pending.includes(lesson.id)} onChange={()=>onComplete(lesson.id)} aria-label={`${rtl?"إكمال":"Complete"}: ${rtl?lesson.ar:lesson.en}`}/>
                <button className="classroom-lesson-select" onClick={()=>onChoose(course.id,lesson.id)} aria-current={activeLesson===lesson.id?"true":undefined}><span>{lessons.findIndex(item=>item.id===lesson.id)+1}. {rtl?lesson.ar:lesson.en}</span><small><PlayCircle/>{lesson.minutes} {rtl?"دقيقة":"min"}{activeLesson===lesson.id&&<b>{rtl?"الدرس الحالي":"Selected"}</b>}</small></button>
                {!!lesson.resources?.length&&<details className="classroom-lesson-resources"><summary><FileText/>{rtl?"المصادر":"Resources"}<ChevronDown/></summary><div>{lesson.resources.map(resource=>resource.url?<a key={resource.id} href={resource.url} target="_blank" rel="noreferrer">{resource.title}</a>:<span key={resource.id}>{resource.title} — {rtl?"غير متاح":"Unavailable"}</span>)}</div></details>}
              </article>):<p className="classroom-section-empty">{rtl?"لا توجد دروس منشورة بعد.":"No published lessons yet."}</p>)}
            </section>;
          })}
        </section>;
      })}
    </nav></>;
}

export function CourseProgress({courses,selected,completed,rtl,pending}:{courses:Course[];selected:string;completed:string[];rtl:boolean;pending:boolean}){
  const course=courses.find(item=>item.id===selected)??courses[0],lessons=course.sections.flatMap(section=>section.lessons),done=lessons.filter(lesson=>completed.includes(lesson.id)).length,percent=lessons.length?Math.round(done/lessons.length*100):0;
  return <Popover.Root><Popover.Trigger className="classroom-progress-trigger" aria-label={`${rtl?"تقدمك":"Your progress"}: ${percent}%`}><span className="classroom-progress-ring"><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="19"/><circle className="ring-value" cx="22" cy="22" r="19" pathLength="100" strokeDasharray={`${percent} 100`}/></svg><Trophy/></span><span>{rtl?"تقدمك":"Your progress"}<small>{percent}%</small></span><ChevronDown/></Popover.Trigger><Popover.Portal><Popover.Content className="classroom-progress-popover" dir={rtl?"rtl":"ltr"} sideOffset={10} align="end" collisionPadding={12}><h2>{rtl?"تقدمك":"Your progress"}</h2><b>{rtl?course.ar:course.en}</b><p>{done} / {lessons.length} {rtl?"دروس مكتملة":"lessons completed"} · {percent}%</p><progress value={done} max={Math.max(1,lessons.length)} aria-label={rtl?"إكمال الكورس":"Course completion"}/><small>{pending?(rtl?"جارٍ الحفظ…":"Saving…"):percent===100?(rtl?"أحسنت! أكملت الكورس.":"Well done! You completed this course."):(rtl?"ضع علامة مكتمل بعد كل درس لتسجيل تقدمك.":"Mark each lesson complete to track your progress.")}</small><h3>{rtl?"كل الكورسات":"All courses"}</h3><ul>{courses.map(item=>{const all=item.sections.flatMap(section=>section.lessons),count=all.filter(lesson=>completed.includes(lesson.id)).length;return <li key={item.id}><span>{rtl?item.ar:item.en}</span><b>{all.length?Math.round(count/all.length*100):0}%</b></li>})}</ul><Popover.Close className="classroom-progress-close" aria-label={rtl?"إغلاق التقدم":"Close progress"}><X/></Popover.Close></Popover.Content></Popover.Portal></Popover.Root>;
}
