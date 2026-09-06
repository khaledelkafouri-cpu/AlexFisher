/** Count unique, available lessons; never round an unfinished curriculum to 100%. */
export function lessonProgress(lessons: {id:string}[], completedIds:string[]){
  const ids=new Set(lessons.map(lesson=>lesson.id));
  const completed=new Set(completedIds);
  const done=[...ids].filter(id=>completed.has(id)).length;
  const total=ids.size;
  return {done,total,percent:total===0?0:done===total?100:Math.floor(done/total*100),complete:total>0&&done===total};
}
