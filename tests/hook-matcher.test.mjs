import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {baitHooks,baits,baitSizes,targets,matchBaitHook,hookTargetFromSpecies} from '../lib/hook-matcher.ts';

const defaults={bait:'shrimp',size:'medium',target:'mixed',approach:'active',end:'eye'};
test('spot-reader fish links map to the new groups without assuming an unknown target',()=>{
  assert.equal(hookTargetFromSpecies('grouper'),'reef');
  assert.equal(hookTargetFromSpecies('seabream'),'bream');
  assert.equal(hookTargetFromSpecies('barracuda'),'toothy');
  assert.equal(hookTargetFromSpecies('unsure'),'mixed');
  assert.equal(hookTargetFromSpecies(null),'mixed');
});
test('eyed and spade variants respond to the attachment preference',()=>{
  assert.equal(matchBaitHook(defaults).hook.id,'chinu-eye');
  assert.equal(matchBaitHook({...defaults,end:'spade'}).hook.id,'chinu-spade');
  assert.equal(matchBaitHook({...defaults,bait:'worm',size:'small',end:'spade'}).hook.id,'fine-spade');
});
test('natural-bait families respond to bait changes',()=>{
  assert.equal(matchBaitHook({...defaults,bait:'worm'}).hook.id,'long');
  assert.equal(matchBaitHook({...defaults,bait:'squid'}).hook.id,'baitholder');
  assert.equal(matchBaitHook({...defaults,bait:'live'}).hook.id,'live');
});
test('powerful targets retain strong wire even when circle logic applies',()=>{
  const strong=matchBaitHook({...defaults,target:'reef'});
  assert.equal(strong.hook.id,'heavy');
  const circle=matchBaitHook({...defaults,target:'pelagic',approach:'steady',end:'spade'});
  assert.equal(circle.hook.id,'circle');
  assert.equal(circle.powerful,true);
  assert.equal(circle.endMismatch,true);
  assert.match(circle.wire.en,/Strong wire/);
  assert.match(circle.hook.setting.en,/Do not strike/);
});
test('size follows bait size, not target weight, and warnings are surfaced',()=>{
  assert.equal(matchBaitHook({...defaults,size:'small',target:'pelagic'}).range,matchBaitHook({...defaults,size:'small'}).range);
  assert.notEqual(matchBaitHook({...defaults,size:'large'}).range,matchBaitHook({...defaults,size:'small'}).range);
  assert.equal(matchBaitHook({...defaults,target:'toothy'}).toothy,true);
  assert.equal(matchBaitHook({...defaults,bait:'bread',target:'pelagic'}).baitWarning,true);
});
test('every supported combination produces a valid, different alternative',()=>{
  for(const bait of baits)for(const size of baitSizes)for(const target of targets)for(const approach of ['active','steady'])for(const end of ['eye','spade']){
    const result=matchBaitHook({bait:bait.id,size:size.id,target:target.id,approach,end});
    assert.ok(result.hook&&result.alternative&&result.range);
    assert.notEqual(result.hook.id,result.alternative.id);
    if(approach==='steady')assert.equal(result.hook.id,'circle');
  }
});
test('library excludes lure-only hooks and every illustration exists',()=>{
  assert.ok(baitHooks.filter(h=>h.end==='spade').length>=2);
  for(const hook of baitHooks){
    assert.ok(!['treble','assist','jighead','ewg','inline'].includes(hook.id));
    assert.ok(existsSync(new URL(`../public${hook.image}`,import.meta.url)),hook.image);
    for(const key of ['name','best','shape','tip','setting'])assert.ok(hook[key].en&&hook[key].ar);
  }
});
