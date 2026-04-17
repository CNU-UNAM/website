<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  import { debounce } from '$lib/utils/debounce';
  import { faculties, facultyCareerMap } from '$lib/data/dataCarreras';

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
    cover_letter: '',
    cv_file: null as File | null
  };
  let selectedFaculty = '';
  let careersList: string[] = [];
  let isSubmitting = false;

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
      cover_letter: '',
      cv_file: null
    };
    selectedFaculty = '';
    careersList = [];
  }

  function closeModal() {
    showModal = false;
    selectedVacancy = null;
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      formData.cv_file = target.files[0];
    }
  }

  // Envío del formulario mediante fetch a la action del servidor
  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (!selectedVacancy) return;

    const formElement = event.target as HTMLFormElement;
    const formDataObj = new FormData(formElement);
    formDataObj.append('vacancyId', selectedVacancy.id);
    if (formData.cv_file) {
      formDataObj.append('cv', formData.cv_file);
    }

    isSubmitting = true;
    try {
      const response = await fetch('/vacantes?/apply', {   // ← Ruta correcta
        method: 'POST',
        body: formDataObj
      });
      const result = await response.json();
      if (result.success) {
        alert('¡Postulación enviada con éxito!');
        closeModal();
      } else {
        alert('Error: ' + (result.message || 'No se pudo procesar la solicitud.'));
      }
    } catch (error) {
      console.error('Error al enviar:', error);
      alert('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
    } finally {
      isSubmitting = false;
    }
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

<div class="section">
  <div class="container">
    <h1 class="title">Vacantes disponibles</h1>

    <div class="filters">
      <div class="search-box">
        <input type="text" placeholder="Buscar por título, descripción o habilidades..." bind:value={searchText} />
      </div>
      <div class="teams-filter">
        <label>Filtrar por área (múltiple):</label>
        <div class="checkbox-group">
          {#each teamsList as team}
            <label>
              <input type="checkbox" bind:group={selectedTeams} value={team} />
              {team}
            </label>
          {/each}
        </div>
      </div>
    </div>

    {#if loading && vacancies.length === 0}
      <div class="loading">Cargando vacantes...</div>
    {:else if vacancies.length === 0}
      <div class="no-results">No se encontraron vacantes con esos criterios.</div>
    {:else}
      <div class="vacancies-grid">
        {#each vacancies as vac}
          <div class="vacancy-card" on:click={() => openModal(vac)}>
            <div class="card-image">
              <img src="https://placehold.co/400x200?text=Vacante" alt={vac.title} />
            </div>
            <div class="card-content">
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
  <div class="modal-overlay" on:click={closeModal}>
    <div class="modal-container" on:click|stopPropagation>
      <div class="modal-header">
        <h2>Postular a: {selectedVacancy.title}</h2>
        <button class="close-button" on:click={closeModal}>×</button>
      </div>

      <form on:submit={handleSubmit} enctype="multipart/form-data">
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
          <input type="file" id="cv" name="cv" accept=".pdf,.docx,.txt" on:change={handleFileChange} required />
        </div>

        <button type="submit" class="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Postularme'}
        </button>
      </form>
    </div>
  </div>
{/if}

<style>
  /* ===== Tus estilos originales (sin cambios) ===== */
  .filters { margin-bottom: 2rem; display: flex; flex-direction: column; gap: 1rem; }
  .search-box input { width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem; font-size: 1rem; }
  .teams-filter { background: #f9f9f9; padding: 1rem; border-radius: 0.5rem; }
  .checkbox-group { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 0.5rem; }
  .checkbox-group label { display: flex; align-items: center; gap: 0.3rem; font-size: 0.9rem; }
  .vacancies-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
  .vacancy-card { background: white; border-radius: 1rem; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s, box-shadow 0.2s; text-decoration: none; color: inherit; display: flex; flex-direction: column; cursor: pointer; }
  .vacancy-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
  .card-image img { width: 100%; height: 160px; object-fit: cover; }
  .card-content { padding: 1rem; }
  .card-content h3 { margin: 0 0 0.5rem 0; font-size: 1.25rem; }
  .team { display: inline-block; background: var(--cnu-yellow); padding: 0.2rem 0.6rem; border-radius: 1rem; font-size: 0.8rem; font-weight: bold; margin-bottom: 0.75rem; }
  .card-content p { font-size: 0.9rem; color: var(--text-muted); line-height: 1.4; }
  .load-more { text-align: center; margin-top: 2rem; }
  .load-more button { background: var(--cnu-coral); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 2rem; font-weight: bold; cursor: pointer; }
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
    background: var(--cnu-coral);
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
  }
</style>