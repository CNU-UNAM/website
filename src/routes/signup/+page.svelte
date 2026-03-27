<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let name = '';
  let team = '';

  async function signup() {
    // Validate email and password fields before proceeding
    if (!email || !password || !name || !team) {
      return alert('All fields are required.');
    }

    // Call Supabase signUp method
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      return alert(error.message);
    }

    const uid = data.user?.id;
    if (!uid) {
      return alert('User ID not found after signup.');
    }

    // Insert profile into `profiles` table
    const { error: profileError } = await supabase.from('profiles').insert({
      id: uid,
      email,
      name,
      team,
      usertype: 'member'
    });

    if (profileError) {
      return alert(profileError.message);
    }

    // Redirect to the /app page
    goto('/app');
  }
</script>

<h1>Crear cuenta</h1>

<input bind:value={name} placeholder="Nombre" />
<input bind:value={team} placeholder="Equipo" />
<input bind:value={email} placeholder="Email" />
<input type="password" bind:value={password} placeholder="Password" />

<button on:click={signup}>Registrarme</button>
