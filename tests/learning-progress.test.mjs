import {test} from 'node:test';
import assert from 'node:assert/strict';
import {lessonProgress} from '../lib/learning-progress.ts';

test('one lesson among all courses contributes only its share',()=>{
  const courses=[{lessons:[{id:'rods'}]},{lessons:[{id:'reels'},{id:'hooks'},{id:'braid'}]}];
  assert.deepEqual(lessonProgress(courses.flatMap(course=>course.lessons),['rods']),{done:1,total:4,percent:25,complete:false});
});
test('completion requires all available lessons and can be unchecked',()=>{
  const lessons=[{id:'one'},{id:'two'}];
  assert.equal(lessonProgress(lessons,['one','two']).percent,100);
  assert.equal(lessonProgress(lessons,['two']).percent,50);
});
test('ignores duplicate and unrelated completion records',()=>{
  assert.deepEqual(lessonProgress([{id:'one'},{id:'one'},{id:'two'}],['one','one','old']),{done:1,total:2,percent:50,complete:false});
});
test('never rounds unfinished progress to 100 and handles empty courses',()=>{
  const lessons=Array.from({length:300},(_,index)=>({id:String(index)}));
  assert.equal(lessonProgress(lessons,lessons.slice(0,-1).map(item=>item.id)).percent,99);
  assert.deepEqual(lessonProgress([],['old']),{done:0,total:0,percent:0,complete:false});
});
