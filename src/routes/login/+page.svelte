<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = '';
  let isLoading = false;

  async function handleLogin() {
    error = '';
    isLoading = true;

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });

    if (loginError) {
      error = loginError.message;
      isLoading = false;
      return;
    }

    goto('/dashboard');
  }
</script>

<!-- Contenedor principal que centra todo en pantalla -->
<div class="min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full space-y-6">
    <h1 class="text-2xl font-semibold text-center">Iniciar sesión</h1>

    <input
      bind:value={email}
      type="email"
      placeholder="Email"
      class="w-full border p-3 rounded-lg"
    />

    <input
      bind:value={password}
      type="password"
      placeholder="Password"
      class="w-full border p-3 rounded-lg"
    />

    <button
      on:click={handleLogin}
      disabled={isLoading}
      class="specialButton w-full p-3 rounded-lg disabled:opacity-50"
    >
      {isLoading ? 'Entrando...' : 'Entrar'}
    </button>

    {#if error}
      <p class="text-red-500 text-sm text-center">{error}</p>
    {/if}
  </div>
</div>

<style>
  /* Definimos la variable de color coral */
  :global(body) {
    --cnu-coral: #ff837d;
  }

  /* Estilo del botón especial */
  .specialButton {
    background: linear-gradient(135deg, var(--cnu-coral) 0%, #ff9a95 100%);
    color: white;
    font-weight: 600;
    position: relative;
    overflow: hidden;
    animation: gentlePulse 2s ease-in-out infinite;
    border: none;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  /* Efecto de brillo (shimmer) */
  .specialButton::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 70%
    );
    animation: shimmer 3s ease-in-out infinite;
  }

  /* Efecto hover */
  .specialButton:hover:not(:disabled) {
    background: linear-gradient(135deg, #ff6b64 0%, var(--cnu-coral) 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 131, 125, 0.4);
  }

  /* Definición de animaciones */
  @keyframes gentlePulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.9;
    }
  }

  @keyframes shimmer {
    0% {
      transform: rotate(0deg) translate(-30%, -30%);
    }
    100% {
      transform: rotate(0deg) translate(30%, 30%);
    }
  }

  /* Ajuste adicional para el estado deshabilitado */
  .specialButton:disabled {
    cursor: not-allowed;
  }
</style>