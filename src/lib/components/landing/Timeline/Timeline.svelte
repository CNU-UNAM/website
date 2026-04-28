<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface TimelineEvent {
    year: number;
    company: string;
    description: string;
    era: EraType;
  }

  type EraType =
    | 'era-fundacion'
    | 'era-baw'
    | 'era-incubadora'
    | 'era-refundacion'
    | 'era-modernizacion';

  const timelineData: TimelineEvent[] = [
    {
      year: 2004,
      company: "Fundación del CNII",
      description: "Se fundó el Centro de Negocios de Ingeniería Industrial (CNII) con la iniciativa del estudiante de Ingeniería Gabriel Regalado y el apoyo del Ing. Antonio Cordero, Jefe del Departamento de Ingeniería Industrial. Su misión: difundir el emprendimiento a través de cursos y talleres.",
      era: "era-fundacion"
    },
    {
      year: 2006,
      company: "Nace el BAW",
      description: "Las estudiantes de Administración Paola Dorado y Lluvia Chávez diseñan el curso Programa de Innovación y Creación de Empresas, hoy conocido como Business Apprentice War (BAW). Su primera emisión marca el inicio del proyecto insignia del CNU, vigente hasta nuestros días.",
      era: "era-baw"
    },
    {
      year: 2010,
      company: "Incubadora FI",
      description: "Inspirada en los objetivos del CNII, la Lic. Paola Dorado abre la Incubadora de la Facultad de Ingeniería, llevando el espíritu emprendedor de la organización a un nuevo nivel institucional dentro de la UNAM.",
      era: "era-incubadora"
    },
    {
      year: 2016,
      company: "Refundación: CNU",
      description: "Bajo la presidencia de Jorge Chávez se logra la refundación de la organización bajo el nombre de Centro de Negocios Universitario (CNU), consolidando una nueva identidad con mayor alcance y visión universitaria.",
      era: "era-refundacion"
    },
    {
      year: 2019,
      company: "Nueva Identidad & Alianzas",
      description: "Bajo la presidencia de Atl Hernández se modernizan la identidad corporativa y los procesos internos, impulsando la tecnologización del CNU. Se consolidan alianzas estratégicas con empresas como IBM, Grupo Modelo, General Electric, Buna, Consulthinks, IMEF Ingeniería y Kubo.financiero.",
      era: "era-modernizacion"
    }
  ];

  let currentIndex = 0;
  let isAnimating = false;
  let autoPlayInterval: ReturnType<typeof setInterval> | null = null;
  let userInteractionTimeout: ReturnType<typeof setTimeout> | null = null;

  // Refs
  let contentElement: HTMLDivElement;

  // Reactive state
  $: currentEvent = timelineData[currentIndex];
  $: progress = (currentIndex / (timelineData.length - 1)) * 100;

  const updateTimeline = (index: number) => {
    if (index === currentIndex || isAnimating) return;
    isAnimating = true;

    contentElement?.classList.add('fade-transition');

    const handleFadeOut = () => {
      contentElement?.removeEventListener('animationend', handleFadeOut);
      currentIndex = index;
      contentElement?.classList.remove('fade-transition');
      contentElement?.classList.add('fade-in');
      setTimeout(() => {
        contentElement?.classList.remove('fade-in');
        isAnimating = false;
      }, 500);
    };

    contentElement?.addEventListener('animationend', handleFadeOut, { once: true });
  };

  const handleSliderInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    updateTimeline(parseInt(target.value));
  };

  const startAutoPlay = () => {
    if (autoPlayInterval) stopAutoPlay();
    autoPlayInterval = setInterval(() => {
      updateTimeline((currentIndex + 1) % timelineData.length);
    }, 4500);
  };

  const stopAutoPlay = () => {
    if (autoPlayInterval) { clearInterval(autoPlayInterval); autoPlayInterval = null; }
  };

  const handleUserInteraction = () => {
    stopAutoPlay();
    if (userInteractionTimeout) clearTimeout(userInteractionTimeout);
    userInteractionTimeout = setTimeout(startAutoPlay, 5000);
  };

  onMount(() => { setTimeout(startAutoPlay, 2000); });
  onDestroy(() => {
    stopAutoPlay();
    if (userInteractionTimeout) clearTimeout(userInteractionTimeout);
  });
</script>

<section class="section section-azul timeline-section">
  <div class="timeline-container">

    <div class="timeline-header">
      <h1 class="timeline-title">Historia</h1>
      <p class="timeline-subtitle">Del CNII al CNU · 20 años de emprendimiento universitario</p>
    </div>

    <!-- Era badge -->
    <div class="era-badge era-{currentEvent.era}">
      {currentEvent.year}
    </div>

    <!-- Content -->
    <div class="timeline-content" bind:this={contentElement}>
      <div class="event-year">{currentEvent.year}</div>
      <div class="event-company">{currentEvent.company}</div>
      <div class="event-description">{currentEvent.description}</div>
    </div>

    <!-- Slider -->
    <div class="slider-container">
      <div class="slider-track">
        <div class="progress-fill" style="width: {progress}%"></div>
        {#each timelineData as _, index}
          <button
            class="tick {index === currentIndex ? 'active' : ''}"
            style="left: calc({(index / (timelineData.length - 1)) * 100}%)"
            aria-label="Ir a {timelineData[index].year}"
            on:click={() => { updateTimeline(index); handleUserInteraction(); }}
          ></button>
        {/each}
      </div>

      <input
        type="range"
        min="0"
        max={timelineData.length - 1}
        bind:value={currentIndex}
        on:input={handleSliderInput}
        on:mousedown={handleUserInteraction}
        on:touchstart={handleUserInteraction}
        on:mouseup={handleUserInteraction}
        on:touchend={handleUserInteraction}
        class="timeline-slider"
        step="1"
        aria-label="Timeline slider"
      />

      <div class="year-labels">
        {#each timelineData as event, index}
          <span
            class="year-label {index === currentIndex ? 'active' : ''}"
            style="left: {(index / (timelineData.length - 1)) * 100}%"
          >
            {event.year}
          </span>
        {/each}
      </div>
    </div>


  </div>
</section>

<style>
  :root {
    --cnu-blue-dark: #465c7f;
    --primary-light: var(--action-yellow);
    --primary: var(--action-yellow);
    --primary-dark: var(--action-red);
    --accent: var(--action-blue);
    --background: #ffffff;
    --foreground: #1e293b;
    --text-muted: #465c7f;
    --card-bg: rgba(255, 255, 255, 0.95);
    --max-width: 1200px;
    --padding-x: 32px;
    --title-size-desktop: 3rem;
    --title-size-mobile: 2rem;
    --subtitle-size: 1.1rem;
    --description-size: 1.05rem;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  /* ── Section ── */
  .section {
    background:
      radial-gradient(circle at top left,  rgba(250, 215, 51, 0.24), transparent 32%),
      radial-gradient(circle at bottom right, rgba(226, 33, 54, 0.2), transparent 30%),
      var(--action-blue);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: var(--foreground);
    line-height: 1.5;
  }

  /* ── Card ── */
  .timeline-container {
    background: var(--card-bg);
    border-radius: 20px;
    padding: 4rem 3rem 3rem;
    max-width: 860px;
    width: 100%;
    box-shadow:
      0 20px 25px -5px rgba(37, 64, 107, 0.18),
      0 10px 10px -5px rgba(37, 64, 107, 0.08);
    text-align: center;
    border: 1px solid rgba(250, 215, 51, 0.22);
    backdrop-filter: blur(10px);
  }

  /* ── Header ── */
  .timeline-header { margin-bottom: 2rem; }

  .timeline-title {
    font-size: var(--title-size-desktop);
    font-weight: 700;
    color: var(--foreground);
    letter-spacing: -0.025em;
    opacity: 0;
    animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .timeline-subtitle {
    font-size: var(--subtitle-size);
    color: var(--text-muted);
    margin-top: 0.4rem;
    opacity: 0;
    animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards;
  }

  /* ── Era badge ── */
  .era-badge {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 5px 16px;
    border-radius: 100px;
    margin-bottom: 1.5rem;
    border: 1.5px solid;
    transition: background 0.4s ease, color 0.4s ease, border-color 0.4s ease;
  }

  .era-era-fundacion    { background: #FEF3C7; color: #92400E; border-color: #FCD34D; }
  .era-era-baw          { background: #FEE2E2; color: #991B1B; border-color: #FCA5A5; }
  .era-era-incubadora   { background: #DBEAFE; color: #1E40AF; border-color: #93C5FD; }
  .era-era-refundacion  { background: #D1FAE5; color: #065F46; border-color: #6EE7B7; }
  .era-era-modernizacion { background: #EDE9FE; color: #5B21B6; border-color: #C4B5FD; }

  /* ── Content ── */
  .timeline-content {
    margin-bottom: 3.5rem;
    min-height: 260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .event-year {
    font-size: 3.5rem;
    font-weight: 700;
    color: var(--action-blue);
    letter-spacing: -0.05em;
    margin-bottom: 0.5rem;
    line-height: 1;
  }

  .event-company {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--action-red);
    letter-spacing: -0.02em;
    margin-bottom: 1.25rem;
  }

  .event-description {
    font-size: var(--description-size);
    max-width: 580px;
    line-height: 1.75;
    color: var(--foreground);
    opacity: 0.82;
  }

  /* ── Slider ── */
  .slider-container {
    position: relative;
    padding: 0 0.5rem;
    margin-bottom: 1.75rem;
  }

  .slider-track {
    position: relative;
    height: 6px;
    background: rgba(37, 64, 107, 0.16);
    border-radius: 8px;
    margin-bottom: 2rem;
    user-select: none;
  }

  .progress-fill {
    position: absolute;
    top: 0; left: 0;
    height: 6px;
    background: linear-gradient(90deg, var(--action-yellow), var(--cnu-coral), var(--action-red));
    border-radius: 8px;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .tick {
    position: absolute;
    top: -4px;
    width: 2px;
    height: 14px;
    background: rgba(37, 64, 107, 0.24);
    border-radius: 1px;
    transform: translateX(-1px);
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .tick.active {
    background: linear-gradient(135deg, var(--action-yellow), var(--action-red));
    height: 18px;
    top: -6px;
    width: 3px;
    box-shadow: 0 0 10px rgba(226, 33, 54, 0.32);
  }

  .year-labels {
    position: relative;
    height: 28px;
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 500;
    user-select: none;
  }

  .year-label {
    position: absolute;
    transform: translateX(-50%);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
  }

  .year-label.active {
    color: var(--action-red);
    font-weight: 700;
    transform: translateX(-50%) scale(1.1);
  }

  .timeline-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    background: transparent;
    outline: none;
    border: none;
    box-shadow: none;
    position: absolute;
    top: 4px; left: 0;
    margin: 0;
    cursor: pointer;
    z-index: 10;
    padding: 0 0.5rem;
  }

  .timeline-slider:focus        { outline: none; border: none; box-shadow: none; }
  .timeline-slider:focus-visible { outline: none; }

  .timeline-slider::-webkit-slider-runnable-track {
    background: transparent;
    border: none;
    outline: none;
    box-shadow: none;
  }

  .timeline-slider::-moz-range-track {
    background: transparent;
    border: none;
    outline: none;
    box-shadow: none;
  }

  .timeline-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 22px; height: 22px;
    border-radius: 50%;
    background: white;
    border: 3px solid var(--action-red);
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(226, 33, 54, 0.22);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-top: -8px;
  }

  .timeline-slider::-webkit-slider-thumb:hover {
    transform: scale(1.15);
    box-shadow: 0 6px 20px rgba(226, 33, 54, 0.28), 0 0 0 8px rgba(250, 215, 51, 0.18);
    border-color: var(--action-yellow);
  }

  .timeline-slider::-moz-range-thumb {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: white;
    border: 3px solid var(--action-red);
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(226, 33, 54, 0.22);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* ── Dot nav ── */
  .dot-nav {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 0.5rem;
  }

  .dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    border: none;
    background: rgba(37, 64, 107, 0.2);
    cursor: pointer;
    padding: 0;
    transition: background 0.3s ease, width 0.3s ease, border-radius 0.3s ease;
  }

  .dot.active {
    width: 24px;
    border-radius: 100px;
    background: linear-gradient(90deg, var(--action-yellow), var(--action-red));
  }

  /* ── Animaciones ── */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fade-transition {
    animation: fadeOutDown 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .fade-in {
    animation: fadeInUpContent 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  @keyframes fadeOutDown {
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(16px); }
  }

  @keyframes fadeInUpContent {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .section { padding: 1rem; }
    .timeline-container { padding: 2.5rem 1.75rem 2.5rem; border-radius: 16px; }
    .timeline-title { font-size: var(--title-size-mobile); }
    .event-year { font-size: 2.5rem; }
    .event-company { font-size: 1.15rem; }
    .event-description { font-size: 0.97rem; }
    .timeline-content { min-height: 240px; margin-bottom: 2.5rem; }
    .year-labels { font-size: 0.75rem; }
  }

  @media (max-width: 480px) {
    .timeline-container { padding: 2rem 1.25rem 2.5rem; }
    .timeline-title { font-size: 1.75rem; }
    .event-year { font-size: 2rem; }
    .year-labels { font-size: 0.68rem; }
  }
</style>