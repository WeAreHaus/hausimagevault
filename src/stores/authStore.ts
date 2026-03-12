import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}

let session: Session | null = null;
let profile: Profile | null = null;
let loading = true;
let listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .eq("id", userId)
    .single();
  return data;
}

async function setSession(s: Session | null) {
  session = s;
  if (s?.user) {
    profile = await fetchProfile(s.user.id);
  } else {
    profile = null;
  }
  loading = false;
  emit();
}

// Initialize
supabase.auth.onAuthStateChange((_event, s) => {
  setSession(s);
});
supabase.auth.getSession().then(({ data: { session: s } }) => {
  if (loading) setSession(s);
});

export const authStore = {
  getSession: () => session,
  getUser: (): User | null => session?.user ?? null,
  getProfile: () => profile,
  isLoading: () => loading,
  isAuthenticated: () => !!session,

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },

  async login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  async signUp(email: string, password: string, displayName?: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  },

  async logout() {
    await supabase.auth.signOut();
  },

  async updateProfile(updates: Partial<Pick<Profile, "display_name" | "avatar_url">>) {
    const user = session?.user;
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (error) throw error;
    profile = { ...profile!, ...updates };
    emit();
  },
};
