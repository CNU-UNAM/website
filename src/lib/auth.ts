import { writable } from 'svelte/store';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js'; // Import the User type

// Define the type for the user, allowing 'null'
export const user = writable<User | null>(null);
export const profile = writable<any | null>(null); // Use a specific profile type if available
export const isAdmin = writable<boolean>(false);

async function loadProfile(uid: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).single();

  if (error) {
    console.error('Error loading profile:', error);
    profile.set(null);
    isAdmin.set(false);
    return;
  }

  profile.set(data ?? null);
  isAdmin.set(data?.usertype === 'admin');
}

supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Error getting session:', error);
    return;
  }
  const session = data.session;
  user.set(session?.user ?? null);
  if (session?.user) loadProfile(session.user.id);
});

supabase.auth.onAuthStateChange((_event, session) => {
  const u = session?.user ?? null;
  user.set(u);
  if (u) loadProfile(u.id);
  else {
    profile.set(null);
    isAdmin.set(false);
  }
});
