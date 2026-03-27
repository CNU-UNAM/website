// $lib/stores/user.ts
import { writable } from 'svelte/store';

export interface EnrichedUser {
  id: string;
  email: string;
  name: string;
  team: string | null;
  usertype: 'admin' | 'member';
  access: number | null;
  emoji: string;
  created_at: string;
  profile?: any; // Datos crudos si los necesitas
}

export const userStore = writable<{
  loading: boolean;
  user: EnrichedUser | null;
  error: string | null;
}>({
  loading: true,
  user: null,
  error: null,
});