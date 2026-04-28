<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import ProjectCard from '$lib/components/proyectos/ProjectCard.svelte';
  import ProjectModal from '$lib/components/proyectos/ProjectModal.svelte';

  let allItems: any[] = [];
  let loading = true;

  // Lógica de Paginado
  let currentPage = 1;
  const itemsPerPage = 6;

  // Modal State
  let selectedProject: any = null;
  let showModal = false;

  onMount(async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      allItems = data.map((item: any) => ({
        ...item,
        imageUrl: item.image_path
          ? supabase.storage.from('imagenes').getPublicUrl(item.image_path).data.publicUrl
          : null
      }));
    }
    loading = false;
  });

  $: paginatedItems = allItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  $: totalPages = Math.ceil(allItems.length / itemsPerPage);

  function openModal(project: any) {
    selectedProject = project;
    showModal = true;
  }

  function handleProjectKeydown(event: KeyboardEvent, project: any) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(project);
    }
  }
</script>

<main class="projects-page">
  
  <div class="bg-decoration" aria-hidden="true">
    <div class="grid-overlay"></div>
    <div class="glow-orb glow-1"></div>
    <div class="glow-orb glow-2"></div>
  </div>
  
  <div class="container">

    <!-- Header -->
    <header class="header">
      <h1 class="title-tight">
        Proyectos <em class="coral">CNU</em>
      </h1>
      <p class="subtitle">
        Innovación, tecnología y talento universitario en un solo ecosistema.
      </p>
      {#if !loading}
        <div class="count-badge">
          <span>{allItems.length} proyectos activos</span>
        </div>
      {/if}
    </header>


    <!-- Estado de carga -->
    {#if loading}
      <div class="loading-state">
        <div class="loader-ring"></div>
        <p class="loading-text">Cargando ecosistema...</p>
      </div>

    {:else if allItems.length === 0}
      <div class="empty-state">
        <p>No hay proyectos disponibles por el momento.</p>
      </div>

    {:else}
      <!-- Grid de proyectos -->
      <div class="bento-grid">
        {#each paginatedItems as item, index (item.id)}
          <div
            class="card-wrapper"
            style="animation-delay: {index * 60}ms"
            on:click={() => openModal(item)}
            on:keydown={(event) => handleProjectKeydown(event, item)}
            role="button"
            tabindex="0"
            aria-label={"Abrir proyecto " + item.title}
          >
            <ProjectCard {item} {index} />
          </div>
        {/each}
      </div>

      <!-- Paginación -->
      {#if totalPages > 1}
        <nav class="pagination" aria-label="Paginación de proyectos">
          <button
            class="page-btn"
            disabled={currentPage === 1}
            on:click={() => currentPage--}
            aria-label="Página anterior"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Anterior
          </button>

          <div class="page-indicator">
            {#each Array(totalPages) as _, i}
              <button
                class="page-dot {currentPage === i + 1 ? 'active' : ''}"
                on:click={() => currentPage = i + 1}
                aria-label={"Ir a página " + (i + 1)}
                aria-current={currentPage === i + 1 ? 'page' : undefined}
              ></button>
            {/each}
          </div>

          <button
            class="page-btn"
            disabled={currentPage === totalPages}
            on:click={() => currentPage++}
            aria-label="Página siguiente"
          >
            Siguiente
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </nav>
      {/if}
    {/if}

  </div>
</main>

{#if showModal}
  <ProjectModal project={selectedProject} bind:showModal />
{/if}

<style>
  /* ── Tokens ── */
  :root {
    --cnu-coral: #D85A30;
    --cnu-coral-light: #FAECE7;
    --action-blue: #185FA5;
    --surface: #ffffff;
    --surface-2: #f7f6f3;
    --border: rgba(0, 0, 0, 0.08);
    --text-primary: #1a1a18;
    --text-muted: #6b6b68;
    --font-display: 'Georgia', 'Times New Roman', serif;
    --font-body: 'DM Sans', 'Helvetica Neue', sans-serif;
    --radius-md: 10px;
    --radius-lg: 16px;
    --transition: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* ── Layout base ── */
  .projects-page {
    background: var(--surface);
    min-height: 100vh;
    padding: 80px 0 100px;
    position: relative;
    overflow: hidden;
    font-family: var(--font-body);
    color: var(--text-primary);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 1;
  }

  /* ── Decoración de fondo ── */
  .bg-decoration { position: absolute; inset: 0; pointer-events: none; }

  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
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
    background: var(--action-blue);
    bottom: 0; left: -80px;
  }

  /* ── Header ── */
  .header {
    text-align: center;
    margin-bottom: 4rem;
    animation: fadeUp 0.6s ease both;
  }

  .title-tight {
    font-size: clamp(2.5rem, 8vw, 4.5rem);
    font-weight: 800;
    line-height: 1.1;
    color: var(--action-blue);
    letter-spacing: -2px;
  }

  .coral {
    color: var(--cnu-coral);
    font-style: italic;
  }

  .subtitle {
    font-size: 1.1rem;
    color: var(--text-muted);
    max-width: 480px;
    margin: 0 auto 1.5rem;
    line-height: 1.6;
  }

  .count-badge {
    display: inline-block;
    background: var(--cnu-coral-light);
    color: var(--cnu-coral);
    font-size: 12px;
    font-weight: 600;
    padding: 5px 14px;
    border-radius: 100px;
    letter-spacing: 0.03em;
  }

  /* ── Loading ── */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 6rem 0;
    color: var(--text-muted);
  }

  .loader-ring {
    width: 36px; height: 36px;
    border: 2px solid var(--border);
    border-top-color: var(--cnu-coral);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .loading-text { font-size: 14px; color: var(--text-muted); }

  /* ── Empty ── */
  .empty-state {
    text-align: center;
    padding: 6rem 0;
    color: var(--text-muted);
    font-size: 15px;
  }

  /* ── Grid ── */
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.25rem;
  }

  .card-wrapper {
    cursor: pointer;
    border-radius: var(--radius-lg);
    outline: none;
    transition: transform var(--transition), box-shadow var(--transition);
    animation: fadeUp 0.5s ease both;
  }

  .card-wrapper:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.09);
  }

  .card-wrapper:focus-visible {
    box-shadow: 0 0 0 3px var(--cnu-coral);
  }

  /* ── Paginación ── */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    margin-top: 4rem;
    animation: fadeUp 0.5s ease both;
  }

  .page-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--action-blue);
    font-size: 13px;
    font-weight: 500;
    font-family: var(--font-body);
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: background var(--transition), border-color var(--transition), color var(--transition);
  }

  .page-btn:hover:not(:disabled) {
    background: var(--surface-2);
    border-color: rgba(0, 0, 0, 0.15);
    color: var(--text-primary);
  }

  .page-btn:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }

  .page-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .page-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    border: none;
    background: var(--border);
    cursor: pointer;
    padding: 0;
    transition: background var(--transition), transform var(--transition), width var(--transition);
  }

  .page-dot.active {
    background: var(--cnu-coral);
    width: 22px;
    border-radius: 100px;
    transform: scale(1);
  }

  /* ── Animaciones ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .bento-grid { grid-template-columns: 1fr; }
    .pagination { gap: 1rem; }
    .page-btn { padding: 9px 14px; font-size: 12px; }
  }
</style>