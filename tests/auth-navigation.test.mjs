import test from 'node:test';
import assert from 'node:assert/strict';
import {safeNext} from '../lib/auth-navigation.ts';
test('authentication redirects stay on the website',()=>{
 for(const value of [null,'https://evil.example','//evil.example','/\\evil.example','/\n/evil.example'])assert.equal(safeNext(value),'/');
 assert.equal(safeNext('/auth/reset-password'),'/auth/reset-password');
 assert.equal(safeNext('/account?tab=profile'),'/account?tab=profile');
});
