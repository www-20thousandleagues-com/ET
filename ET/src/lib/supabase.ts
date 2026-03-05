import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let _supabase: SupabaseClient<Database> | null = null;

function getClient(): SupabaseClient<Database> {
  if (!_supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
    }
    _supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop) {
    return Reflect.get(getClient(), prop);
  },
});

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
