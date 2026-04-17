<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import CardContainer from '$lib/components/CardContainer.svelte';

  let name = '';
  let team = '';
  let email = '';
  let password = '';
  let isLoading = false;
  let errorMessage = '';

  async function handleSignup() {
    if (!email || !password || !name || !team) {
      errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    isLoading = true;
    errorMessage = '';

    try {
      // 1. Registro de usuario en Auth
      const { data, error: authError } = await supabase.auth.signUp({ 
        email, 
        password 
      });

      if (authError) throw authError;

      // 2. Creación del perfil en la tabla de base de datos
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          name,
          team,
          email,
          usertype: 'member'
        });

        if (profileError) throw profileError;
        
        // Redirección al éxito
        goto('/app');
      }
    } catch (err: any) {
      errorMessage = err.message;
    } finally {
      isLoading = false;
    }
  }
</script>

<main class="page-container">
  <CardContainer 
    title="Crear cuenta" 
    subtitle="Únete a la comunidad CNU"
    submitLabel="Registrarme"
    {isLoading}
    on:submit={handleSignup}
  >
    <label for="name">Nombre</label>
    <input id="name" type="text" bind:value={name} placeholder="Tu nombre" required />

    <label for="team">Equipo</label>
    <input id="team" type="text" bind:value={team} placeholder="Nombre de tu equipo" required />

    <label for="email">Email</label>
    <input id="email" type="email" bind:value={email} placeholder="correo@cnu.edu" required />

    <label for="password">Contraseña</label>
    <input id="password" type="password" bind:value={password} placeholder="••••••••" required />

    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {/if}

    <div slot="actions">
      <button 
        type="button" 
        class="btn-secondary-cnu" 
        on:click={() => goto('/login')}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </button>
    </div>
  </CardContainer>
</main>

<style>
  .page-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fcfcfc;
    padding: 1rem;
  }

  .error {
    color: var(--action-red);
    background: #fff5f5;
    padding: 0.75rem;
    border-radius: 8px;
    margin-top: 1rem;
    text-align: center;
    font-size: 0.85rem;
    border: 1px solid var(--action-red);
  }
</style>
