import { create } from "zustand";
import type { User, Session, Subscription } from "@supabase/supabase-js";
import type { Profile } from "@/types/database";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

let authSubscription: Subscription | null = null;

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

function enterUnconfiguredState(set: (state: Partial<AuthState>) => void) {
  set({
    devMode: false,
    user: null,
    profile: null,
    loading: false,
    initialized: true,
  });
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,
  initialized: false,
  devMode: false,

  initialize: async () => {
    if (get().initialized) return;

    if (!isSupabaseConfigured()) {
      enterUnconfiguredState(set);
      return;
    }

    try {
      // Register listener first to avoid race window between getSession and auth events
      if (authSubscription) {
        authSubscription.unsubscribe();
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          set({ user: session.user, session, profile, loading: false, initialized: true });
        } else {
          set({ user: null, session: null, profile: null, loading: false, initialized: true });
        }
      });
      authSubscription = subscription;

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      // If there's a stale/invalid refresh token, clear it and continue as logged out
      if (sessionError) {
        await supabase.auth.signOut().catch(() => {});
        set({ loading: false, initialized: true });
        return;
      }

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
    } catch {
      enterUnconfiguredState(set);
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
