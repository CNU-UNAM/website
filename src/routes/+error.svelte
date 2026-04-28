<script lang="ts">
  import { page } from '$app/stores';
  import { dev } from '$app/environment';

  const status = $derived($page.status);
  const error = $derived($page.error);

  const messages: Record<number, { title: string; subtitle: string }> = {
    404: { title: 'Página no encontrada', subtitle: 'La página que buscas no existe o fue movida.' },
    500: { title: 'Error interno', subtitle: 'Algo salió mal. Intenta de nuevo más tarde.' },
  };

  const msg = $derived(messages[status] ?? { title: 'Error', subtitle: 'Ocurrió un error inesperado.' });
</script>

<div class="error-page">
  <div class="bg-decoration" aria-hidden="true">
    <div class="grid-overlay"></div>
    <div class="glow-orb glow-1"></div>
    <div class="glow-orb glow-2"></div>
  </div>

  <div class="container">
    <div class="error-card">
      <span class="error-code" style="color: var(--cnu-coral)">{status}</span>
      <h1 class="error-title">{msg.title}</h1>
      <p class="error-subtitle">{msg.subtitle}</p>
      {#if dev && error?.message}
        <pre class="error-detail">{error.message}</pre>
      {/if}
      <a href="/" class="back-link">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M10 12L6 8L10 4"/></svg>
        Volver al inicio
      </a>
    </div>
  </div>
</div>

<style>
  .error-page {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    position: relative;
    overflow: hidden;
    padding: 80px 0;
  }

  .bg-decoration { position: absolute; inset: 0; pointer-events: none; }

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

  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px;
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
  }

  .error-card {
    text-align: center;
    max-width: 480px;
  }

  .error-code {
    display: block;
    font-size: clamp(6rem, 15vw, 10rem);
    font-weight: 900;
    line-height: 1;
    letter-spacing: -4px;
    margin-bottom: 8px;
  }

  .error-title {
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    font-weight: 800;
    color: var(--action-blue);
    margin: 0 0 12px;
    letter-spacing: -1px;
  }

  .error-subtitle {
    font-size: 1.1rem;
    color: #666;
    margin: 0 0 32px;
    line-height: 1.6;
  }

  .error-detail {
    background: #f8f7f4;
    border: 1px solid #e8e8e8;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 32px;
    font-size: 0.8rem;
    color: var(--cnu-coral);
    text-align: left;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--action-blue);
    color: white;
    padding: 14px 32px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 1rem;
    transition: transform 0.2s, box-shadow 0.2s;
    text-decoration: none;
  }

  .back-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 64, 107, 0.25);
    opacity: 1;
  }
</style>
