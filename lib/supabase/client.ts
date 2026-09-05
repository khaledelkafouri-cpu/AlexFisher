import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./config";
export function createSupabaseClient() { return isSupabaseConfigured ? createBrowserClient(supabaseUrl, supabaseKey) : null; }
