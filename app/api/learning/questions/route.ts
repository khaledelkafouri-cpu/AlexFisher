import {NextRequest,NextResponse} from "next/server";
import {learningLessonAccess} from "@/lib/learning-access";

const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const fields="id,body,created_at,author_id,profiles!author_id(display_name)";
const json=(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{"Cache-Control":"private, no-store"}});

export async function GET(req:NextRequest){
  const lessonId=req.nextUrl.searchParams.get("lesson_id")??"",questionId=req.nextUrl.searchParams.get("question_id"),offset=Number(req.nextUrl.searchParams.get("offset")??0);
  if(!Number.isSafeInteger(offset)||offset<0||offset>100000||(questionId&&!uuid.test(questionId)))return json({error:"Invalid discussion request."},400);
  const ctx=await learningLessonAccess(req,lessonId);if("response" in ctx)return ctx.response;
  const query=questionId?ctx.admin.from("learning_replies").select(fields).eq("question_id",questionId):ctx.admin.from("learning_questions").select(fields);
  const {data,error}=await query.eq("lesson_id",lessonId).order("created_at",{ascending:!!questionId}).order("id",{ascending:!!questionId}).range(offset,offset+20);
  if(error)return json({error:"Q&A is temporarily unavailable. Please try again later."},503);
  return json({items:(data??[]).slice(0,20).map(row=>({id:row.id,body:row.body,created_at:row.created_at,author:((row.profiles as unknown as {display_name?:string})?.display_name)||"Member"})),hasMore:(data?.length??0)>20});
}

export async function POST(req:NextRequest){
  let body;try{body=await req.json()}catch{return json({error:"Invalid request."},400)}
  if(!body||typeof body!=="object")return json({error:"Invalid request."},400);
  const lessonId=String(body.lesson_id??""),questionId=body.question_id,content=typeof body.body==="string"?body.body.trim():"";
  if(!content||content.length>4000||(questionId&&(!uuid.test(questionId)||typeof questionId!=="string")))return json({error:"Write a question or reply between 1 and 4,000 characters."},400);
  const ctx=await learningLessonAccess(req,lessonId);if("response" in ctx)return ctx.response;
  const since=new Date(Date.now()-60000).toISOString();
  const recent=await Promise.all(["learning_questions","learning_replies"].map(table=>ctx.admin.from(table).select("id",{count:"exact",head:true}).eq("author_id",ctx.user.id).gte("created_at",since)));
  if(recent.some(result=>result.error))return json({error:"Q&A is temporarily unavailable. Please try again later."},503);
  if(recent.reduce((sum,result)=>sum+(result.count??0),0)>=5)return json({error:"Please wait a minute before posting again."},429);
  if(questionId){const question=await ctx.admin.from("learning_questions").select("id").eq("id",questionId).eq("lesson_id",lessonId).maybeSingle();if(question.error)return json({error:"Unable to load this question."},503);if(!question.data)return json({error:"This question is no longer available."},404)}
  const {data,error}=await ctx.admin.from(questionId?"learning_replies":"learning_questions").insert({lesson_id:lessonId,author_id:ctx.user.id,body:content,...(questionId?{question_id:questionId}:{})}).select("id,body,created_at").single();
  if(error)return json({error:"Your message could not be saved. Please try again."},503);
  return json({item:{...data,author:ctx.profile.display_name||"Member"}},201);
}
