<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  export let title = "";
  export let subtitle = "";
  export let submitLabel = "Confirmar";
  export let isLoading = false;

  const dispatch = createEventDispatcher();

  function handleSubmit() {
    if (isLoading) return;
    dispatch('submit');
  }
</script>

<div class="agnostic-card" in:fly={{ y: 20, duration: 600 }}>
  {#if title || subtitle}
    <header class="card-header">
      <h2>{title}</h2>
      {#if subtitle}<p>{subtitle}</p>{/if}
    </header>
  {/if}

  <form on:submit|preventDefault={handleSubmit} class="form-wrapper">
    <div class="slot-content">
      <slot />
    </div>

    <footer class="card-footer">
      <button type="submit" class="btn-primary" disabled={isLoading}>
        {#if isLoading}<span class="loader"></span>{:else}{submitLabel}{/if}
      </button>
      
      <div class="actions-area">
        <slot name="actions" />
      </div>
    </footer>
  </form>
</div>

<style>
  .agnostic-card {
    background: #fff;
    border: 2px solid var(--cnu-blue);
    padding: 2.5rem;
    border-radius: 16px;
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
  }

  .card-header { text-align: center; margin-bottom: 2rem; }
  h2 { font-weight: 800; font-size: 1.75rem; margin: 0; color: var(--action-blue); }
  p { color: #666; margin-top: 0.5rem; }

  .form-wrapper { display: flex; flex-direction: column; }

  /* Estilos globales para los inputs del slot */
  .slot-content :global(label) {
    display: block;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    margin-top: 1.25rem;
  }

  .slot-content :global(input) {
    width: 100%;
    padding: 0.85rem;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    background: #fafafa;
  }

  /* Footer y Espaciado de 20px */
  .card-footer {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem; /* Los 20px de separación */
  }

  button {
    width: 100%;
    padding: 1rem;
    border-radius: 8px;
    border: none;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-primary { background: var(--action-blue); color: white; }

  .actions-area :global(.btn-secondary-cnu) {
    background: var(--cnu-coral);
    color: var(--action-blue);
    width: 100%;
    padding: 1rem;
    border-radius: 8px;
    font-weight: 700;
    border: none;
    cursor: pointer;
  }

  .loader {
    width: 18px;
    height: 18px;
    border: 2px solid #fff;
    border-top-color: transparent;
    border-radius: 50%;
    display: inline-block;
    animation: spin 0.6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
