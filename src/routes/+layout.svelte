<script lang="ts">
	import './layout.css';
	import '../app.css';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';
	import { userStore } from '$lib/stores/session';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	
	// Props necesarios para el layout (children)
	let { children } = $props();

	// Función para cargar sesión + perfil enriquecido
	async function loadEnrichedUser() {
		try {
			// 1. Obtener sesión
			const { data: { session }, error: sessionError } = await supabase.auth.getSession();
			
			if (sessionError) throw sessionError;

			if (!session?.user) {
				// No hay sesión activa
				userStore.set({ loading: false, user: null, error: null });
				return;
			}

			// 2. Obtener perfil de la tabla profiles
			const { data: profile, error: profileError } = await supabase
				.from('profiles')
				.select('name, team, usertype, access, emoji, created_at')
				.eq('id', session.user.id)
				.single();

			if (profileError && profileError.code !== 'PGRST116') {
				throw profileError;
			}

			// 3. Construir objeto de usuario enriquecido
			const enrichedUser = {
				id: session.user.id,
				email: session.user.email,
				name: profile?.name ?? session.user.user_metadata?.name ?? 'Usuario',
				team: profile?.team ?? null,
				usertype: profile?.usertype ?? 'member',
				access: profile?.access ?? 1,
				emoji: profile?.emoji ?? '🚀',
				created_at: profile?.created_at ?? new Date().toISOString(),
				profile: profile ?? null // Datos crudos por si acaso
			};

			userStore.set({ loading: false, user: enrichedUser, error: null });
			
		} catch (err) {
			console.error('Error cargando usuario:', err);
			userStore.set({ loading: false, user: null, error: (err as Error).message });
		}
	}

	onMount(() => {
		// Cargar usuario inicial
		loadEnrichedUser();

		// Escuchar cambios en autenticación
		const { data: listener } = supabase.auth.onAuthStateChange(() => {
			loadEnrichedUser(); // Recargar completo en cada cambio
		});

		return () => {
			listener?.subscription.unsubscribe();
		};
	});
</script>

<!-- Layout sin cambios visuales -->
<div class="min-h-screen flex flex-col">
	<Navbar />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
