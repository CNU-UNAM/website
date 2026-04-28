<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  import { debounce } from '$lib/utils/debounce';
  import { faculties, facultyCareerMap } from '$lib/data/dataCarreras';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';

  const cardColors = ['var(--cnu-yellow)', 'var(--cnu-coral)', 'var(--cnu-blue)'];

  // ========== Variables del listado (originales) ==========
  let searchText = '';
  let selectedTeams: string[] = [];
  let teamsList: string[] = [];
  let itemsPerPage = 9;
  let currentPage = 1;
  let totalCount = 0;
  let loading = false;
  let vacancies: any[] = [];

  // ========== Variables del modal ==========
  let showModal = false;
  let selectedVacancy: any | null = null;
  let formData = {
    full_name: '',
    email: '',
    faculty: '',
    career: '',
    phone: '',
    cover_letter: ''
  };
  let selectedFaculty = '';
  let careersList: string[] = [];
  let isSubmitting = false;

  // Manejar resultado del formulario
  $: if ($page.form?.type === 'success') {
    alert('¡Postulación enviada con éxito!');
    closeModal();
    // Reset form result
    setTimeout(() => {
      $page.form = null;
    }, 100);
  } else if ($page.form?.type === 'error') {
    alert('Error: ' + ($page.form.error?.message || 'No se pudo procesar la solicitud.'));
    // Reset form result
    setTimeout(() => {
      $page.form = null;
    }, 100);
  }

  // ========== Funciones del listado (sin cambios) ==========
  async function loadTeams() {
    const { data, error } = await supabase
      .from('vacancies_postings')
      .select('team')
      .eq('active', 1)
      .not('team', 'is', null);
    if (!error && data) {
      teamsList = [...new Set(data.map(item => item.team).filter(Boolean))];
    }
  }

  async function loadVacancies(resetPage = true) {
    if (resetPage) currentPage = 1;
    loading = true;
    try {
      let query = supabase
        .from('vacancies_postings')
        .select('*', { count: 'exact' })
        .eq('active', 1);

      if (selectedTeams.length > 0) {
        query = query.in('team', selectedTeams);
      }
      if (searchText.trim()) {
        query = query.or(
          `title.ilike.%${searchText}%,description.ilike.%${searchText}%,skills.ilike.%${searchText}%`
        );
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;
      if (error) throw error;
      vacancies = data || [];
      totalCount = count || 0;
    } catch (err) {
      console.error(err);
    } finally {
      loading = false;
    }
  }

  const debouncedLoad = debounce(() => loadVacancies(true), 300);

  $: {
    searchText;
    selectedTeams;
    debouncedLoad();
  }

  function loadMore() {
    if (currentPage * itemsPerPage < totalCount) {
      currentPage++;
      loadVacancies(false);
    }
  }

  function truncate(text: string, maxLength: number) {
    if (!text) return '';
    return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
  }

  function handleVacancyKeydown(event: KeyboardEvent, vacancy: any) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(vacancy);
    }
  }

  // ========== Funciones del modal ==========
  function openModal(vacancy: any) {
    selectedVacancy = vacancy;
    showModal = true;
    // Resetear formulario
    formData = {
      full_name: '',
      email: '',
      faculty: '',
      career: '',
      phone: '',
      cover_letter: ''
    };
    selectedFaculty = '';
    careersList = [];
  }

  function closeModal() {
    showModal = false;
    selectedVacancy = null;
  }

  // Reactividad para carreras según facultad
  $: {
    if (selectedFaculty) {
      careersList = facultyCareerMap[selectedFaculty as keyof typeof facultyCareerMap] || [];
      formData.career = '';
    } else {
      careersList = [];
    }
  }

  onMount(() => {
    loadTeams();
    loadVacancies(true);
  });
</script>

<div class="vacantes-page">
  <!-- Fondo decorativo igual que Proyectos y Nosotros -->
  <div class="bg-decoration" aria-hidden="true">
    <div class="grid-overlay"></div>
    <div class="glow-orb glow-1"></div>
    <div class="glow-orb glow-2"></div>
  </div>

  <div class="container main-content">
    <!-- Header -->
    <header class="vacantes-header">
      <h1 class="title">Vacantes <span class="coral">disponibles</span></h1>
      <p class="subtitle">Únete al CNU y forma parte de nuestros proyectos de innovación.</p>
    </header>

    <div class="filters">
      <div class="search-box">
        <input type="text" placeholder="Buscar por título, descripción o habilidades..." bind:value={searchText} />
      </div>
      <div class="teams-filter">
        <fieldset>
          <legend>Filtrar por área (múltiple):</legend>
          <div class="checkbox-group">
            {#each teamsList as team}
              <label>
                <input type="checkbox" bind:group={selectedTeams} value={team} />
                {team}
              </label>
            {/each}
          </div>
        </fieldset>
      </div>
    </div>

    {#if loading && vacancies.length === 0}
      <div class="loading">Cargando vacantes...</div>
    {:else if vacancies.length === 0}
      <div class="no-results">No se encontraron vacantes con esos criterios.</div>
    {:else}
      <div class="vacancies-grid">
        {#each vacancies as vac, index}
          <div
            class="vacancy-card"
            style="--card-accent: {cardColors[index % cardColors.length]}"
            on:click={() => openModal(vac)}
            on:keydown={(event) => handleVacancyKeydown(event, vac)}
            role="button"
            tabindex="0"
            aria-label={"Abrir vacante " + vac.title}
          >
            <div class="card-content">
              <span class="card-kicker">Vacante abierta</span>
              <h3>{vac.title}</h3>
              <span class="team">{vac.team || 'Sin área'}</span>
              <p>{truncate(vac.description || '', 100)}</p>
            </div>
          </div>
        {/each}
      </div>

      {#if currentPage * itemsPerPage < totalCount}
        <div class="load-more">
          <button on:click={loadMore} disabled={loading}>
            {loading ? 'Cargando...' : 'Cargar más'}
          </button>
        </div>
      {/if}
    {/if}
  </div>
</div>

<!-- Modal -->
{#if showModal && selectedVacancy}
  <div class="modal-overlay" on:click={closeModal} on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') closeModal(); }} aria-label="Cerrar modal" role="button" tabindex="0">
    <div class="modal-container" role="dialog" tabindex="-1" on:click|stopPropagation>
      <div class="modal-header">
        <h2>Postular a: {selectedVacancy.title}</h2>
        <button class="close-button" on:click={closeModal}>×</button>
      </div>

      <form method="POST" action="?/apply" enctype="multipart/form-data" use:enhance>
        <input type="hidden" name="vacancyId" value={selectedVacancy.id} />
        <div class="form-group">
          <label for="full_name">Nombre completo *</label>
          <input type="text" id="full_name" name="full_name" bind:value={formData.full_name} required />
        </div>

        <div class="form-group">
          <label for="email">Correo electrónico *</label>
          <input type="email" id="email" name="email" bind:value={formData.email} required />
        </div>

        <div class="form-group">
          <label for="faculty">Facultad *</label>
          <select id="faculty" name="faculty" bind:value={selectedFaculty} required>
            <option value="">Selecciona una facultad</option>
            {#each faculties as fac}
              <option value={fac}>{fac}</option>
            {/each}
          </select>
        </div>

        <div class="form-group">
          <label for="career">Carrera *</label>
          <select id="career" name="career" bind:value={formData.career} required disabled={!selectedFaculty}>
            <option value="">Selecciona una carrera</option>
            {#each careersList as career}
              <option value={career}>{career}</option>
            {/each}
          </select>
        </div>

        <div class="form-group">
          <label for="phone">Número de teléfono</label>
          <input type="tel" id="phone" name="phone" bind:value={formData.phone} />
        </div>

        <div class="form-group">
          <label for="cover_letter">¿Por qué te interesa entrar al CNU?</label>
          <textarea id="cover_letter" name="cover_letter" bind:value={formData.cover_letter} rows="4"></textarea>
        </div>

        <div class="form-group">
          <label for="cv">Adjuntar CV (PDF, DOCX, TXT) *</label>
          <input type="file" id="cv" name="cv" accept=".pdf,.docx,.txt" required />
        </div>

        <button type="submit" class="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Postularme'}
        </button>
      </form>
    </div>
  </div>
{/if}

<style>
  /* ── Base ── */
  .vacantes-page {
    padding: 80px 0;
    background-color: #ffffff;
    position: relative;
    overflow: hidden;
  }
  
  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px;
    position: relative;
    z-index: 1;
  }

  .main-content {
    position: relative;
    z-index: 2;
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

  /* ── Header ── */
  .vacantes-header {
    text-align: center;
    margin-bottom: 64px;
  }

  .title {
    font-size: clamp(2.5rem, 8vw, 4rem);
    font-weight: 800;
    line-height: 1.1;
    color: var(--action-blue);
    letter-spacing: -2px;
    margin: 0 0 1rem 0;
  }

  .title .coral {
    color: var(--cnu-coral);
  }

  .subtitle {
    font-size: 1.2rem;
    color: #666;
    max-width: 600px;
    margin: 1rem auto 0;
  }

  /* ===== Tus estilos originales (sin cambios) ===== */
  .filters { margin-bottom: 2rem; display: flex; flex-direction: column; gap: 1rem; }
  .search-box input { width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem; font-size: 1rem; }
  .teams-filter { background: #f9f9f9; padding: 1rem; border-radius: 0.5rem; }
  .checkbox-group { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 0.5rem; }
  .checkbox-group label { display: flex; align-items: center; gap: 0.3rem; font-size: 0.9rem; }
  .vacancies-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
  .vacancy-card {
    background: #fff;
    border-radius: 32px;
    border: 3px solid var(--card-accent);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    color: inherit;
    display: flex;
    min-height: 260px;
    cursor: pointer;
  }
  .vacancy-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
  }
  .card-content {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .card-kicker {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.6px;
    font-size: 0.8rem;
    color: var(--cnu-coral);
    margin-bottom: 1rem;
  }
  .card-content h3 {
    margin: 0 0 0.75rem 0;
    font-size: 2rem;
    line-height: 1.1;
    color: var(--action-blue);
  }
  .team {
    display: inline-flex;
    align-self: flex-start;
    background: color-mix(in srgb, var(--card-accent) 18%, white);
    border-radius: 999px;
    padding: 0.35rem 0.85rem;
    font-size: 0.8rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--action-blue);
  }
  .card-content p {
    font-size: 1rem;
    color: #555;
    line-height: 1.5;
    margin: 0;
  }
  .load-more { text-align: center; margin-top: 2rem; }
  .load-more button { background: var(--action-blue); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 2rem; font-weight: bold; cursor: pointer; }
  .load-more button:disabled { opacity: 0.6; }
  .loading, .no-results { text-align: center; padding: 3rem; color: var(--text-muted); }

  /* ===== Estilos del modal ===== */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal-container {
    background-color: white;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    padding: 1.5rem;
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--border-color);
    width: 100%;
  }
  .modal-header h2 {
    font-size: 1.5rem;
    margin: 0;
  }
  .close-button {
    background: none;
    border: none;
    font-size: 1.8rem;
    cursor: pointer;
    line-height: 1;
    margin-left: auto;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    min-height: 32px;
  }
  .form-group {
    margin-bottom: 1rem;
  }
  .form-group label {
    display: block;
    margin-bottom: 0.3rem;
    font-weight: bold;
  }
  .form-group input, .form-group select, .form-group textarea {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    font-family: inherit;
  }
  .submit-button {
    background: var(--action-blue);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 2rem;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    width: 100%;
    margin-top: 0.5rem;
  }
  .submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  @media (max-width: 768px) {
    .vacancies-grid { grid-template-columns: 1fr; }
    .modal-container { padding: 1rem; }
    .vacancy-card { min-height: auto; border-radius: 28px; }
    .card-content { padding: 1.5rem; }
    .card-content h3 { font-size: 1.6rem; }
  }
</style>
