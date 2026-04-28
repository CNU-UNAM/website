<script lang="ts">
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import { faculties, facultyCareerMap } from '$lib/data/dataCarreras';

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

  $: vacancy = $page.data.vacancy;

  $: if ($page.form?.type === 'success') {
    alert('¡Postulación enviada con éxito!');
    resetForm();
    setTimeout(() => {
      $page.form = null;
    }, 100);
  } else if ($page.form?.type === 'error') {
    alert('Error: ' + ($page.form.error?.message || 'No se pudo procesar la solicitud.'));
    setTimeout(() => {
      $page.form = null;
    }, 100);
  }

  function resetForm() {
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

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return 'Fecha no publicada';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  $: {
    if (selectedFaculty) {
      careersList = facultyCareerMap[selectedFaculty as keyof typeof facultyCareerMap] || [];
      formData.career = '';
    } else {
      careersList = [];
    }
  }
</script>

<div class="vacancy-detail-page">
  <!-- Fondo decorativo -->
  <div class="bg-decoration" aria-hidden="true">
    <div class="grid-overlay"></div>
    <div class="glow-orb glow-1"></div>
    <div class="glow-orb glow-2"></div>
  </div>

  <div class="container">
    <!-- Header -->
    <header class="page-header">
      <h1 class="title">{vacancy.title}</h1>
      <p class="subtitle">{vacancy.team || 'Sin área especificada'}</p>
    </header>

    <div class="content-grid">
      <!-- Columna izquierda: Información de la vacante -->
      <article class="vacancy-info-section">
        <div class="info-card">
          <div class="info-row">
            <span class="label">Área:</span>
            <span class="badge">{vacancy.team || 'Sin área'}</span>
          </div>
          <div class="info-row">
            <span class="label">Publicado:</span>
            <span class="value">{formatDate(vacancy.created_at)}</span>
          </div>
        </div>

        <section class="info-section">
          <h2 class="section-title">Descripción</h2>
          <div class="section-content">
            {vacancy.description || 'Sin descripción disponible.'}
          </div>
        </section>

        {#if vacancy.skills}
          <section class="info-section">
            <h2 class="section-title">Habilidades requeridas</h2>
            <div class="skills-container">
              {#each vacancy.skills.split(',').map((s: string) => s.trim()) as skill}
                <span class="skill-tag">{skill}</span>
              {/each}
            </div>
          </section>
        {/if}
      </article>

      <!-- Columna derecha: Formulario -->
      <aside class="form-section">
        <div class="form-card">
          <h2 class="form-title">Postularse</h2>
          <p class="form-subtitle">Completa el formulario para enviar tu candidatura</p>

          <form method="POST" action="?/apply" enctype="multipart/form-data" use:enhance>
            <input type="hidden" name="vacancyId" value={vacancy.id} />

            <div class="form-group">
              <label for="full_name">Nombre completo *</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                bind:value={formData.full_name}
                required
              />
            </div>

            <div class="form-group">
              <label for="email">Correo electrónico *</label>
              <input
                type="email"
                id="email"
                name="email"
                bind:value={formData.email}
                required
              />
            </div>

            <div class="form-group">
              <label for="faculty">Facultad *</label>
              <select
                id="faculty"
                name="faculty"
                bind:value={selectedFaculty}
                required
              >
                <option value="">Selecciona una facultad</option>
                {#each faculties as fac}
                  <option value={fac}>{fac}</option>
                {/each}
              </select>
            </div>

            <div class="form-group">
              <label for="career">Carrera *</label>
              <select
                id="career"
                name="career"
                bind:value={formData.career}
                required
                disabled={!selectedFaculty}
              >
                <option value="">Selecciona una carrera</option>
                {#each careersList as career}
                  <option value={career}>{career}</option>
                {/each}
              </select>
            </div>

            <div class="form-group">
              <label for="phone">Número de teléfono</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                bind:value={formData.phone}
              />
            </div>

            <div class="form-group">
              <label for="cover_letter">¿Por qué te interesa el CNU?</label>
              <textarea
                id="cover_letter"
                name="cover_letter"
                bind:value={formData.cover_letter}
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="cv">Adjuntar CV (PDF, DOCX, TXT) *</label>
              <input
                type="file"
                id="cv"
                name="cv"
                accept=".pdf,.docx,.txt"
                required
              />
            </div>

            <button
              type="submit"
              class="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Postularme ahora'}
            </button>
          </form>
        </div>
      </aside>
    </div>
  </div>
</div>

<style>
  /* ── Base ── */
  .vacancy-detail-page {
    padding: 80px 0;
    background-color: #ffffff;
    position: relative;
    overflow: hidden;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    position: relative;
    z-index: 1;
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
      linear-gradient(rgba(0, 0, 0, 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 0, 0, 0.06) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.4) 20%,
      rgba(0, 0, 0, 0.4) 80%,
      transparent 100%
    );
  }

  .glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
  }
  .glow-1 {
    width: 500px;
    height: 500px;
    background: var(--cnu-coral);
    top: -120px;
    right: -100px;
  }
  .glow-2 {
    width: 400px;
    height: 400px;
    background: var(--cnu-blue);
    bottom: 0;
    left: -80px;
  }

  /* ── Header ── */
  .page-header {
    text-align: center;
    margin-bottom: 64px;
  }

  .title {
    font-size: clamp(2rem, 6vw, 3.5rem);
    font-weight: 800;
    line-height: 1.1;
    color: var(--action-blue);
    letter-spacing: -1px;
    margin: 0 0 12px 0;
  }

  .subtitle {
    font-size: 1.1rem;
    color: var(--cnu-coral);
    font-weight: 600;
    margin: 0;
  }

  /* ── Grid ── */
  .content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 40px;
    align-items: start;
  }

  /* ── Sección de información ── */
  .vacancy-info-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .info-card {
    background: #f8f7f4;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid #e8e8e8;
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .info-row:last-child {
    margin-bottom: 0;
  }

  .label {
    font-weight: 700;
    color: var(--action-blue);
    min-width: 80px;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .badge {
    display: inline-block;
    background: var(--cnu-yellow);
    color: var(--action-blue);
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .value {
    color: #555;
    font-size: 1rem;
  }

  /* ── Secciones de información ── */
  .info-section {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 16px;
    padding: 24px;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--action-blue);
    margin: 0 0 16px 0;
    letter-spacing: -0.5px;
  }

  .section-content {
    font-size: 1rem;
    line-height: 1.7;
    color: #555;
    white-space: pre-wrap;
  }

  /* ── Skills ── */
  .skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .skill-tag {
    display: inline-block;
    background: #f0f0f0;
    color: #333;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    border: 1px solid #e0e0e0;
  }

  /* ── Formulario ── */
  .form-section {
    position: sticky;
    top: 100px;
  }

  .form-card {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  }

  .form-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--action-blue);
    margin: 0 0 8px 0;
    letter-spacing: -0.5px;
  }

  .form-subtitle {
    font-size: 0.9rem;
    color: #888;
    margin: 0 0 24px 0;
  }

  .form-group {
    margin-bottom: 18px;
  }

  .form-group label {
    display: block;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 6px;
    color: var(--action-blue);
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1.5px solid #e0e0e0;
    border-radius: 8px;
    font-size: 0.95rem;
    font-family: inherit;
    transition: border-color 0.2s;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--action-blue);
    box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.1);
  }

  .form-group textarea {
    resize: vertical;
  }

  .submit-button {
    width: 100%;
    background: linear-gradient(135deg, var(--action-blue), #1a4d7a);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    margin-top: 8px;
  }

  .submit-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(24, 95, 165, 0.2);
  }

  .submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .content-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    .form-section {
      position: static;
    }
  }

  @media (max-width: 600px) {
    .vacancy-detail-page {
      padding: 48px 0;
    }

    .page-header {
      margin-bottom: 40px;
    }

    .title {
      font-size: clamp(1.5rem, 5vw, 2.5rem);
    }

    .content-grid {
      gap: 24px;
    }

    .info-card,
    .info-section,
    .form-card {
      padding: 16px;
    }
  }
</style>
