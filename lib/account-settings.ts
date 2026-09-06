export const activityIds = ['fishing', 'surfing', 'kayaking'] as const;
export type ProfileSettings = {display_name:string;country:string;city:string;interests:string[]};
export function cleanProfile(profile:ProfileSettings) {
  const display_name=profile.display_name.trim(),country=profile.country.trim(),city=profile.city.trim();
  if(!display_name||display_name.length>60)throw new Error('name');
  if(country.length>80||city.length>80)throw new Error('location');
  if(profile.interests.some(value=>!activityIds.includes(value as typeof activityIds[number])))throw new Error('interests');
  return {display_name,country:country||null,city:city||null,interests:[...new Set(profile.interests)]};
}
export function passwordIssue(password:string,confirmation:string):'length'|'mismatch'|null {
  if(password.length<12||password.length>128)return 'length';
  return password===confirmation?null:'mismatch';
}
