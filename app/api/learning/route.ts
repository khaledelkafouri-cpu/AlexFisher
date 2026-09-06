import {learningLessonAccess} from "@/lib/learning-access";
import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {createSupabaseAdmin} from "@/lib/supabase/admin";

async function member(req:NextRequest){const admin=createSupabaseAdmin(),token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,""),url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;if(!admin||!token||!url||!key)return null;const auth=createClient(url,key,{auth:{persistSession:false}}),{data:{user}}=await auth.auth.getUser(token);if(!user)return null;const{data:contact}=await admin.from("audience_contacts").select("plan,subscription_status").eq("user_id",user.id).maybeSingle();return{admin,user,plan:contact?.plan??"free",subscriptionStatus:contact?.subscription_status??"active"}}

export async function GET(req:NextRequest){const ctx=await member(req);if(!ctx)return NextResponse.json({error:"Sign in to open the academy."},{status:401});const{admin,user,plan,subscriptionStatus}=ctx;const[courses,sections,lessons,resources,access,progress]=await Promise.all([
  admin.from("learning_courses").select("*").eq("status","published").order("sort_order"),
  admin.from("learning_sections").select("*").order("sort_order"),
  admin.from("learning_lessons").select("*").eq("status","published").order("sort_order"),
  admin.from("learning_resources").select("*").order("sort_order"),
  admin.from("course_plan_access").select("*"),
  admin.from("learning_progress").select("lesson_id,completed,progress_seconds,updated_at").eq("user_id",user.id),
]);
const error=[courses,sections,lessons,resources,access,progress].find(result=>result.error)?.error;if(error)return NextResponse.json({error:error.message},{status:503});const allowed=(courses.data??[]).filter(course=>{const plans=(access.data??[]).filter(item=>item.course_id===course.id).map(item=>item.plan_code);return plans.length===0||plans.includes(plan)}),allowedIds=new Set(allowed.map(course=>course.id)),allowedSections=(sections.data??[]).filter(section=>allowedIds.has(section.course_id)),sectionIds=new Set(allowedSections.map(section=>section.id)),allowedLessons=(lessons.data??[]).filter(item=>sectionIds.has(item.section_id)),lessonIds=new Set(allowedLessons.map(item=>item.id)),resourceRows=await Promise.all((resources.data??[]).filter(item=>lessonIds.has(item.lesson_id)).map(async item=>{if(item.resource_type!=="file")return{...item,url:item.external_url};const{data}=await admin.storage.from("course-resources").createSignedUrl(item.storage_path,3600);return{...item,url:data?.signedUrl??null}}));return NextResponse.json({courses:allowed.map(course=>({...course,sections:allowedSections.filter(section=>section.course_id===course.id).map(section=>({...section,lessons:allowedLessons.filter(item=>item.section_id===section.id).map(item=>({...item,resources:resourceRows.filter(resource=>resource.lesson_id===item.id)}))}))})),progress:progress.data??[],plan,subscriptionStatus},{headers:{"Cache-Control":"private, no-store, max-age=0"}})}

export async function POST(req:NextRequest){
  let body;try{body=await req.json()}catch{return NextResponse.json({error:"Invalid request."},{status:400})}
  if(!body||typeof body.completed!=="boolean")return NextResponse.json({error:"A completion value is required."},{status:400});
  const lessonId=String(body.lesson_id??""),ctx=await learningLessonAccess(req,lessonId);
  if("response" in ctx)return ctx.response;
  const seconds=Number(body.progress_seconds??0);
  if(!Number.isFinite(seconds)||seconds<0)return NextResponse.json({error:"Invalid playback progress."},{status:400});
  const {error}=await ctx.admin.from("learning_progress").upsert({user_id:ctx.user.id,lesson_id:lessonId,completed:body.completed,progress_seconds:Math.floor(seconds),completed_at:body.completed?new Date().toISOString():null,updated_at:new Date().toISOString()});
  if(error)return NextResponse.json({error:"Unable to save progress."},{status:400});
  return NextResponse.json({ok:true});
}
