import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {createSupabaseAdmin} from "@/lib/supabase/admin";

export async function learningLessonAccess(req:NextRequest,lessonId:string){
  const admin=createSupabaseAdmin(),token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,""),url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const fail=(error:string,status:number)=>({response:NextResponse.json({error},{status})} as const);
  if(!admin||!url||!key)return fail("Learning is temporarily unavailable.",503);
  if(!token)return fail("Sign in to join the discussion.",401);
  const auth=createClient(url,key,{auth:{persistSession:false}});
  const {data:{user},error:authError}=await auth.auth.getUser(token);
  if(authError||!user)return fail("Please sign in again.",401);
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lessonId))return fail("Lesson is unavailable.",404);
  const [profile,contact,lesson]=await Promise.all([
    admin.from("profiles").select("display_name,role,account_status,banned").eq("id",user.id).maybeSingle(),
    admin.from("audience_contacts").select("plan,subscription_status").eq("user_id",user.id).maybeSingle(),
    admin.from("learning_lessons").select("id,section_id,status").eq("id",lessonId).maybeSingle(),
  ]);
  if(profile.error||contact.error||lesson.error)return fail("Unable to check lesson access.",503);
  if(!profile.data||profile.data.banned||profile.data.account_status==="suspended")return fail("Your account cannot access this lesson.",403);
  if(!lesson.data||lesson.data.status!=="published")return fail("Lesson is unavailable.",404);
  const section=await admin.from("learning_sections").select("course_id").eq("id",lesson.data.section_id).maybeSingle();
  if(section.error)return fail("Unable to check lesson access.",503);
  if(!section.data)return fail("Course is unavailable.",404);
  const [course,access]=await Promise.all([
    admin.from("learning_courses").select("id,status").eq("id",section.data.course_id).maybeSingle(),
    admin.from("course_plan_access").select("plan_code").eq("course_id",section.data.course_id),
  ]);
  if(course.error||access.error)return fail("Unable to check lesson access.",503);
  if(course.data?.status!=="published")return fail("Course is unavailable.",404);
  const plan=contact.data?.plan??"free";
  if(access.data?.length&&!access.data.some(entry=>entry.plan_code===plan))return fail("Your plan does not include this course.",403);
  if(contact.data&&!['active','trialing'].includes(contact.data.subscription_status))return fail("An active membership is required.",403);
  return {admin,user,profile:profile.data,lesson:lesson.data} as const;
}
