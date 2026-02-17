import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface AuthUser {
  id: string;
  email: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  birthdate: string | null;
  bio: string;
  profile_photo_url: string | null;
  youtube_url: string | null;
  twitter_url: string | null;
  tiktok_url: string | null;
  instagram_url: string | null;
  github_url: string | null;
  website_url: string | null;
}

export const authService = {
  async register(email: string, password: string): Promise<{ user: AuthUser; error: string | null }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!user) throw new Error('User creation failed');

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          user_id: user.id,
          name: email.split('@')[0],
          bio: '',
        }]);

      if (profileError) throw profileError;

      return { user: { id: user.id, email: user.email || '' }, error: null };
    } catch (error: any) {
      return { user: null as any, error: error.message };
    }
  },

  async signIn(email: string, password: string): Promise<{ user: AuthUser; error: string | null }> {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!user) throw new Error('Sign in failed');

      return { user: { id: user.id, email: user.email || '' }, error: null };
    } catch (error: any) {
      return { user: null as any, error: error.message };
    }
  },

  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      return { id: user.id, email: user.email || '' };
    } catch {
      return null;
    }
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch {
      return null;
    }
  },

  async updateProfile(userId: string, profile: Partial<UserProfile>): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async uploadProfilePhoto(userId: string, file: File): Promise<{ url: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return { url: data.publicUrl, error: null };
    } catch (error: any) {
      return { url: null, error: error.message };
    }
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      (() => {
        if (session?.user) {
          callback({ id: session.user.id, email: session.user.email || '' });
        } else {
          callback(null);
        }
      })();
    });
  },
};
