import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanProfile,passwordIssue} from '../lib/account-settings.ts';
test('profile writes contain only editable fields',()=>{
  assert.deepEqual(cleanProfile({display_name:'  Sam  ',country:' Egypt ',city:' ',interests:['fishing','fishing'],role:'admin',plan:'annual'}),{display_name:'Sam',country:'Egypt',city:null,interests:['fishing']});
});
test('profile validation rejects blank names, long locations and invalid interests',()=>{
  const p={display_name:'Sam',country:'',city:'',interests:[]};
  assert.throws(()=>cleanProfile({...p,display_name:'  '}));
  assert.throws(()=>cleanProfile({...p,display_name:'x'.repeat(61)}));
  assert.throws(()=>cleanProfile({...p,city:'x'.repeat(81)}));
  assert.throws(()=>cleanProfile({...p,interests:['admin']}));
});
test('Arabic names and optional empty preferences are supported',()=>{
  assert.equal(cleanProfile({display_name:' أحمد ',country:'مصر',city:'',interests:[]}).display_name,'أحمد');
});
test('password requires a long matching confirmation without trimming secrets',()=>{
  assert.equal(passwordIssue('short','short'),'length');
  assert.equal(passwordIssue('long-passphrase','different'),'mismatch');
  assert.equal(passwordIssue('long-passphrase','long-passphrase'),null);
  assert.equal(passwordIssue('long-passphrase ','long-passphrase'),'mismatch');
});
