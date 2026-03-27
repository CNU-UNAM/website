import { supabase } from '$lib/supabase';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Obtener sesión del lado del servidor
	const { data: { session } } = await supabase.auth.getSession();
	event.locals.session = session;

	return resolve(event);
};