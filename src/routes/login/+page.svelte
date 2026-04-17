<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import CardContainer from '$lib/components/CardContainer.svelte';

  let email = '';
  let password = '';
  let isLoading = false;
  let errorMessage = '';

  async function handleLogin() {
    isLoading = true;
    errorMessage = '';
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      errorMessage = error.message;
      isLoading = false;
    } else {
      goto('/app');
    }
  }
</script>

<main class="page-container">
  <CardContainer 
    title="Acceso CNU" 
    submitLabel="Entrar"
    {isLoading}
    on:submit={handleLogin}
  >
    <label for="email">Email</label>
    <input id="email" type="email" bind:value={email} required />

    <label for="password">Contraseña</label>
    <input id="password" type="password" bind:value={password} required />

    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {/if}

    <div slot="actions">
      <button 
        type="button" 
        class="btn-secondary-cnu" 
        on:click={() => goto('/recuperar')}
      >
        ¿Olvidaste tu contraseña?
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
  }

  .error {
    color: #c53030;
    background: #fff5f5;
    padding: 0.75rem;
    border-radius: 8px;
    margin-top: 1rem;
    text-align: center;
    font-size: 0.85rem;
    border: 1px solid #feb2b2;
  }
</style>