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

  // Items calculados para la página actual
  $: paginatedItems = allItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  $: totalPages = Math.ceil(allItems.length / itemsPerPage);

  function openModal(project: any) {
    selectedProject = project;
    showModal = true;
  }
</script>

<main class="projects-page">
  <div class="container">
    <header class="header">
      <h1 class="title">Proyectos <span class="coral">CNU</span></h1>
    </header>

    {#if loading}
      <div class="loading">Cargando ecosistema...</div>
    {:else}
      <div class="bento-grid">
        {#each paginatedItems as item (item.id)}
          <div on:click={() => openModal(item)} role="button" tabindex="0">
            <ProjectCard {item} index={item.id} />
          </div>
        {/each}
      </div>

      {#if totalPages > 1}
        <div class="pagination">
          <button disabled={currentPage === 1} on:click={() => currentPage--}>Anterior</button>
          <span>Página {currentPage} de {totalPages}</span>
          <button disabled={currentPage === totalPages} on:click={() => currentPage++}>Siguiente</button>
        </div>
      {/if}
    {/if}
  </div>
</main>

{#if showModal}
  <ProjectModal project={selectedProject} bind:showModal />
{/if}

<style>
  .projects-page { background: #ffffff; min-height: 100vh; padding: 60px 0; }
  .coral { color: var(--cnu-coral); }
  .header { text-align: center; margin-bottom: 3rem; }

  .bento-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    margin-top: 3rem;
  }

  .pagination button {
    padding: 10px 20px;
    border: 1px solid #ddd;
    background: white;
    color: var(--action-blue);
    cursor: pointer;
    border-radius: 8px;
    font-weight: bold;
  }

  .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }

  @media (max-width: 768px) { .bento-grid { grid-template-columns: 1fr; } }
</style>
