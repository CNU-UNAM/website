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

<div class="auth-page">
  <!-- Fondo decorativo -->
  <div class="bg-decoration" aria-hidden="true">
    <div class="grid-overlay"></div>
    <div class="glow-orb glow-1"></div>
    <div class="glow-orb glow-2"></div>
  </div>

  <main class="page-container">
    <div class="content-wrapper">
      <header class="auth-header">
        <h1 class="title">Acceso <span class="coral">CNU</span></h1>
        <p class="subtitle">Ingresa a tu cuenta para acceder a nuestros proyectos.</p>
      </header>

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
    </div>
  </main>
</div>

<style>
  .auth-page {
    min-height: 100vh;
    background-color: #ffffff;
    position: relative;
    overflow: hidden;
    display: flex;
  }

  /* ── Fondo decorativo ── */
  .bg-decoration { 
    position: absolute; 
    inset: 0; 
    pointer-events: none; 
  }

  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.4) 80%, transparent 100%);
  }

  .glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
  }
  .glow-1 {
    width: 500px; height: 500px;
    background: var(--cnu-coral);
    top: -120px; right: -100px;
  }
  .glow-2 {
    width: 400px; height: 400px;
    background: var(--cnu-blue);
    bottom: 0; left: -80px;
  }

  .page-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    width: 100%;
    padding: 1rem;
  }

  .content-wrapper {
    width: 100%;
    max-width: 500px;
  }

  .auth-header {
    text-align: center;
    margin-bottom: 48px;
    max-width: 420px;
    margin-left: auto;
    margin-right: auto;
  }

  .title {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    line-height: 1.1;
    color: var(--action-blue);
    letter-spacing: -1px;
    margin: 0 0 12px 0;
  }

  .title .coral {
    color: var(--cnu-coral);
  }

  .subtitle {
    font-size: 1rem;
    color: #666;
    margin: 0;
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
