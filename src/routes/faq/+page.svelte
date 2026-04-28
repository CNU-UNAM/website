<script lang="ts">
  import FAQItem from "$lib/components/faq/FAQItem.svelte";

  const faqs = [
    { category: "Comunidad", question: "¿Necesito ser de la FI para entrar?", answer: "Priorizamos a la comunidad de la Facultad de Ingeniería, pero estamos abiertos a colaboraciones multidisciplinarias de toda la UNAM." },
    { category: "Empresas", question: "¿Cómo se formaliza un patrocinio?", answer: "Mediante convenios de colaboración con Fundación UNAM para asegurar transparencia y beneficios fiscales." },
    { category: "Academia", question: "¿Tienen programa de servicio social?", answer: "Sí, contamos con programas registrados para diversas carreras de ingeniería." },
    { category: "Emprendedores", question: "¿Ayudan con el registro de marca?", answer: "Brindamos orientación inicial y vinculación con expertos en propiedad intelectual de la UNAM." },
    { category: "Academia", question: "¿Qué tipo de proyectos pueden desarrollarse en el CNU?", answer: "Proyectos de innovación tecnológica, prototipado, investigación aplicada y soluciones de ingeniería con impacto social o industrial." },
    { category: "Comunidad", question: "¿Cómo me puedo unir al CNU como estudiante?", answer: "Puedes registrarte en nuestras convocatorias semestrales o acercarte directamente en los eventos de bienvenida al inicio de cada semestre." },
    { category: "Emprendedores", question: "¿Ofrecen mentoría para validar mi idea de negocio?", answer: "Contamos con mentores de la industria y academia que acompañan a emprendedores desde la ideación hasta la validación con usuarios reales." },
    { category: "Empresas", question: "¿Pueden las empresas plantear retos tecnológicos al CNU?", answer: "Sí, las empresas pueden presentar retos que nuestros equipos aborden como proyectos de innovación, con beneficios mutuos y esquemas de confidencialidad." },
    { category: "Academia", question: "¿El CNU otorga créditos académicos por participar?", answer: "La participación puede reconocerse a través de servicio social, prácticas profesionales o actividades extracurriculares, según el programa de cada alumno." },
    { category: "Comunidad", question: "¿Pueden participar profesores o investigadores de la UNAM?", answer: "Absolutamente. Fomentamos la vinculación entre alumnos, profesores e investigadores para potenciar proyectos interdisciplinarios." },
    { category: "Emprendedores", question: "¿Ayudan a conseguir financiamiento para startups?", answer: "Orientamos sobre fondos públicos como CONACYT, concursos nacionales y fondos de inversión, y conectamos con nuestra red en el ecosistema emprendedor." },
    { category: "Empresas", question: "¿Qué beneficios obtiene una empresa al colaborar con el CNU?", answer: "Acceso a talento universitario, desarrollo de soluciones innovadoras, visibilidad ante la comunidad de la FI y posibilidad de deducción fiscal mediante convenios con Fundación UNAM." },
  ];

  let query = "";
  let currentCat = "Todos";

  const catColors: Record<string, { bg: string; text: string }> = {
    Todos:         { bg: "var(--action-blue)",  text: "#fff" },
    Comunidad:     { bg: "var(--cnu-coral)",    text: "var(--action-blue)" },
    Empresas:      { bg: "var(--cnu-yellow)",   text: "var(--action-blue)" },
    Academia:      { bg: "var(--cnu-blue)",     text: "var(--action-blue)" },
    Emprendedores: { bg: "var(--action-yellow)",text: "var(--action-blue)" }
  };

  const cats = Object.keys(catColors).map(name => ({ name, ...catColors[name] }));

  // Conteo por categoría para las badges
  const countFor = (cat: string) =>
    cat === "Todos"
      ? faqs.length
      : faqs.filter(f => f.category === cat).length;

  $: filtered = faqs.filter(f =>
    (currentCat === "Todos" || f.category === currentCat) &&
    f.question.toLowerCase().includes(query.toLowerCase())
  );

  // Limpiar búsqueda
  const clearQuery = () => { query = ""; };
</script>

<div class="faq-root">

  <!-- Fondo decorativo igual que Proyectos y Nosotros -->
  <div class="bg-decoration" aria-hidden="true">
    <div class="grid-overlay"></div>
    <div class="glow-orb glow-1"></div>
    <div class="glow-orb glow-2"></div>
  </div>

  <div class="container main-content">

    <!-- Header -->
    <header class="faq-header">
      <h1 class="title">Preguntas <span class="coral">Frecuentes</span></h1>
      <p class="subtitle">Encuentra respuestas sobre comunidad, proyectos y cómo colaborar con el CNU.</p>

      <!-- Buscador -->
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.6"/>
          <path d="M13 13l3.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
        <input
          type="text"
          placeholder="¿En qué podemos ayudarte?"
          bind:value={query}
          aria-label="Buscar pregunta"
        />
        {#if query}
          <button class="clear-btn" on:click={clearQuery} aria-label="Limpiar búsqueda">
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </button>
        {/if}
      </div>
    </header>

    <!-- Filtros -->
    <nav class="filter-nav" aria-label="Filtrar por categoría">
      {#each cats as cat}
        <button
          class="filter-btn"
          class:active={currentCat === cat.name}
          style="--active-color: {cat.bg}; --active-text: {cat.text}"
          on:click={() => currentCat = cat.name}
          aria-pressed={currentCat === cat.name}
        >
          {cat.name}
          <span class="cat-count">{countFor(cat.name)}</span>
        </button>
      {/each}
    </nav>

    <!-- Lista -->
    <section class="faq-list" aria-live="polite">
      {#if filtered.length > 0}
        <p class="results-label">
          {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
          {currentCat !== 'Todos' ? `en ${currentCat}` : ''}
        </p>
        {#each filtered as faq, i (faq.question)}
          <div class="faq-item-wrap" style="animation-delay: {i * 45}ms">
            <FAQItem {...faq} catColor={catColors[faq.category]?.bg ?? 'var(--cnu-coral)'} />
          </div>
        {/each}
      {:else}
        <div class="empty-state">
          <svg viewBox="0 0 48 48" fill="none" width="48" height="48" aria-hidden="true">
            <circle cx="22" cy="22" r="14" stroke="currentColor" stroke-width="2" opacity=".3"/>
            <path d="M32 32l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".3"/>
            <path d="M18 22h8M22 18v8" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".3"/>
          </svg>
          <p>No hay resultados para <strong>"{query}"</strong></p>
          <button class="reset-btn" on:click={() => { query = ""; currentCat = "Todos"; }}>
            Limpiar filtros
          </button>
        </div>
      {/if}
    </section>

    <!-- Footer CTA -->
    <footer class="support-wrap">
      <div class="support-card">
        <div class="support-text">
          <h2>¿Dudas adicionales?</h2>
          <p>Nuestro equipo está listo para ayudarte con lo que necesites.</p>
        </div>
        <a href="mailto:hola@cnu.mx" class="btn-primary">Escríbenos</a>
      </div>
    </footer>

  </div>
</div>

<style>
  /* ── Fondo decorativo (mismo que Proyectos y Nosotros) ── */
  .faq-root {
    background: #ffffff;
    min-height: 100vh;
    padding: 60px 0 80px;
    position: relative;
    overflow: hidden;
  }

  .bg-decoration { position: absolute; inset: 0; pointer-events: none; z-index: 0; }

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
  .glow-1 { width: 500px; height: 500px; background: var(--cnu-coral); top: -120px; right: -100px; }
  .glow-2 { width: 400px; height: 400px; background: var(--cnu-blue);  bottom: 0;   left: -80px;  }

  /* ── Container ── */
  .container {
    max-width: 860px;
    margin: 0 auto;
    padding: 0 1.5rem;
    position: relative;
    z-index: 1;
  }

  /* ── Header ── */
  .faq-header {
    text-align: center;
    margin-bottom: 2.5rem;
    animation: fadeUp 0.6s ease both;
  }

  .title {
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    font-weight: 800;
    color: var(--action-blue);
    letter-spacing: -0.025em;
    line-height: 1.1;
    margin-bottom: 0.75rem !important;
    margin-top: 0 !important;
  }

  .coral { color: var(--cnu-coral); }

  .subtitle {
    font-size: 1rem;
    color: #666;
    max-width: 480px;
    margin: 0 auto 1.75rem;
    line-height: 1.6;
  }

  /* ── Buscador ── */
  .search-box {
    position: relative;
    max-width: 500px;
    margin: 0 auto;
  }

  .search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px; height: 18px;
    color: #aaa;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 14px 44px 14px 48px;
    border-radius: 50px;
    border: 1.5px solid #e8e8e8;
    outline: none;
    font-size: 0.95rem;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(8px);
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
    color: #222;
  }

  input:focus {
    border-color: var(--action-blue);
    box-shadow: 0 0 0 4px rgba(24, 95, 165, 0.08);
  }

  .clear-btn {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: #f0f0f0;
    border: none;
    border-radius: 50%;
    width: 26px; height: 26px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #888;
    transition: background 0.2s;
  }
  .clear-btn:hover { background: #e0e0e0; color: #333; }

  /* ── Filtros ── */
  .filter-nav {
    display: grid;
    gap: 8px;
    margin-bottom: 2rem;
    grid-template-columns: repeat(3, 1fr);
    animation: fadeUp 0.6s ease 0.1s both;
  }

  .filter-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 18px;
    border-radius: 100px;
    border: 1.5px solid #e8e8e8;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(6px);
    cursor: pointer;
    font-weight: 600;
    font-size: 0.875rem;
    color: #555;
    transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    width: 100%;
  }

  .filter-btn:hover:not(.active) {
    border-color: #ccc;
    background: #fff;
    transform: translateY(-1px);
  }

  .filter-btn.active {
    background-color: var(--active-color);
    border-color: var(--active-color);
    color: var(--active-text, #fff);
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  }

  .cat-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 18px;
    padding: 0 5px;
    border-radius: 100px;
    font-size: 10px;
    font-weight: 700;
    background: rgba(0,0,0,0.07);
    color: inherit;
  }

  .filter-btn.active .cat-count {
    background: rgba(0,0,0,0.1);
  }

  /* ── Lista ── */
  .faq-list {
    max-width: 800px;
    margin: 0 auto;
  }

  .results-label {
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 1rem;
    padding-left: 4px;
  }

  .faq-item-wrap {
    opacity: 0;
    animation: fadeUp 0.45s ease both;
  }

  /* ── Empty state ── */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 4rem 0;
    color: #bbb;
    text-align: center;
  }

  .empty-state p { font-size: 0.95rem; color: #888; }
  .empty-state strong { color: #555; }

  .reset-btn {
    margin-top: 4px;
    padding: 8px 20px;
    border-radius: 100px;
    border: 1.5px solid #ddd;
    background: white;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--action-blue);
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .reset-btn:hover { background: #f5f5f5; border-color: #bbb; }

  /* ── CTA footer ── */
  .support-wrap { margin-top: 4rem; }

  .support-card {
    background: var(--action-blue);
    padding: 40px 48px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .support-text h2 {
    font-size: 1.3rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
  }

  .support-text p {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.75);
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    color: var(--action-blue);
    padding: 12px 28px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 700;
    font-size: 0.9rem;
    white-space: nowrap;
    transition: transform 0.2s, box-shadow 0.2s;
    flex-shrink: 0;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  }

  /* ── Animaciones ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }

  /* ── Responsive ── */
  @media (max-width: 1023px) {
    .filter-nav {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .support-card {
      flex-direction: column;
      text-align: center;
      padding: 32px 24px;
    }

    .filter-nav {
      grid-template-columns: 1fr;
    }

    .filter-btn { font-size: 0.8rem; padding: 7px 14px; }
  }
</style>