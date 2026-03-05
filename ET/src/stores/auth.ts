import { create } from "zustand";
import type { User, Session } from "@supabase/supabase-js";
import type { Profile } from "@/types/database";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

type AuthState = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  devMode: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,
  initialized: false,
  devMode: false,

  initialize: async () => {
    if (get().initialized) return;

    // If Supabase isn't configured, enter dev mode (skip auth)
    if (!isSupabaseConfigured()) {
      set({
        devMode: true,
        user: { id: "dev-user", email: "dev@jaegeren.local" } as User,
        profile: {
          id: "dev-user",
          email: "dev@jaegeren.local",
          full_name: "Developer",
          avatar_url: null,
          role: "admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        loading: false,
        initialized: true,
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        set({ user: session.user, session, profile, loading: false, initialized: true });
      } else {
        set({ loading: false, initialized: true });
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          set({ user: session.user, session, profile });
        } else {
          set({ user: null, session: null, profile: null });
        }
      });
    } catch {
      // Supabase unreachable — enter dev mode
      set({
        devMode: true,
        user: { id: "dev-user", email: "dev@jaegeren.local" } as User,
        profile: {
          id: "dev-user",
          email: "dev@jaegeren.local",
          full_name: "Developer",
          avatar_url: null,
          role: "admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        loading: false,
        initialized: true,
      });
    }
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  },

  signUp: async (email, password, fullName) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error: error?.message ?? null };
  },

  signOut: async () => {
    if (!get().devMode) {
      await supabase.auth.signOut();
    }
    set({ user: null, session: null, profile: null });
  },
}));
