<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface TimelineEvent {
    year: number;
    company: string;
    description: string;
    icon: string;
    era: EraType;
  }

  type EraType = 
    | 'era-early-web'
    | 'era-dot-com'
    | 'era-social-media'
    | 'era-mobile'
    | 'era-modern'
    | 'era-future-tech';

  const timelineData: TimelineEvent[] = [
    {
      year: 2004,
      company: "CNII",
      description: "En el 2004 se fundó el Centro de Negocios de Ingeniería Industrial (CNII), con la iniciativa del estudiante de Ingeniería Gabriel Regalado y con el apoyo, hasta su salida en 2006, del Ingeniero Antonio Cordero, Jefe del Departamento de Ingeniería Industrial. A partir de ese año, la Maestra Ingeniera Silvina Hernández es quien ha brindado apoyo a la agrupación estudiantil.",
      icon: "fa-globe",
      era: "era-early-web"
    },
    {
      year: 1994,
      company: "Amazon",
      description: "Jeff Bezos starts selling books online. Fast-forward: now he sells *everything* and flies to space for fun.",
      icon: "fa-shopping-cart",
      era: "era-early-web"
    },
    {
      year: 1998,
      company: "Google",
      description: "A couple of students make a search engine. Eventually becomes the place where everyone diagnoses themselves with terminal illness.",
      icon: "fa-magnifying-glass",
      era: "era-dot-com"
    },
    {
      year: 2003,
      company: "Skype",
      description: "Invented so people could have awkward frozen video calls long before Zoom made it cool.",
      icon: "fa-phone",
      era: "era-dot-com"
    },
    {
      year: 2004,
      company: "Facebook",
      description: "Started as a way to rate classmates, now it’s where your aunt argues about politics and shares minion memes.",
      icon: "fa-users",
      era: "era-social-media"
    },
    {
      year: 2005,
      company: "YouTube",
      description: "Originally for sharing funny videos. Now it's tutorials, drama, and 9-hour compilations of 'lofi beats to cry to.'",
      icon: "fa-play",
      era: "era-social-media"
    },
    {
      year: 2007,
      company: "iPhone",
      description: "The tiny touchscreen rectangle that made everyone forget how to make eye contact in public.",
      icon: "fa-mobile-screen",
      era: "era-mobile"
    },
    {
      year: 2010,
      company: "Instagram",
      description: "Photo app that evolved into a curated museum of people’s brunch, pets, and suspiciously perfect beach bodies.",
      icon: "fa-camera",
      era: "era-mobile"
    },
    {
      year: 2016,
      company: "TikTok",
      description: "App where teenagers dance, lip-sync, and accidentally become millionaires overnight.",
      icon: "fa-video",
      era: "era-modern"
    },
    {
      year: 2019,
      company: "5G Networks",
      description: "Blazing fast internet that somehow still drops during important Zoom meetings.",
      icon: "fa-tower-broadcast",
      era: "era-modern"
    },
    {
      year: 2020,
      company: "Remote Revolution",
      description: "Thanks to a global pandemic, everyone discovers working in pajamas is the future of productivity (and back pain).",
      icon: "fa-laptop",
      era: "era-modern"
    },
    {
      year: 2025,
      company: "AI Integration",
      description: "Smart assistants everywhere because what we really needed was our fridge judging our snacking habits.",
      icon: "fa-brain",
      era: "era-future-tech"
    }
  ];

  let currentIndex = 0;
  let isAnimating = false;
  let autoPlayInterval: NodeJS.Timeout | null = null;
  let userInteractionTimeout: NodeJS.Timeout | null = null;
  
  // Refs
  let contentElement: HTMLDivElement;
  let eventIcon: HTMLDivElement;
  let eventYear: HTMLDivElement;
  let eventCompany: HTMLDivElement;
  let eventDescription: HTMLDivElement;
  let progressFill: HTMLDivElement;

  // Reactive state
  let currentEvent = timelineData[currentIndex];
  let progress = (currentIndex / (timelineData.length - 1)) * 100;
  let currentEra = currentEvent.era;

  $: currentEvent = timelineData[currentIndex];
  $: progress = (currentIndex / (timelineData.length - 1)) * 100;
  $: currentEra = currentEvent.era;

  const updateTimeline = (index: number) => {
    if (index === currentIndex || isAnimating) return;

    isAnimating = true;
    
    // Animate out
    contentElement?.classList.add('fade-transition');
    [eventIcon, eventYear, eventCompany, eventDescription].forEach(el => 
      el?.classList.add('fade-out')
    );

    const handleFadeOut = () => {
      contentElement?.removeEventListener('animationend', handleFadeOut);
      
      // Update content
      currentIndex = index;
      
      // Animate in
      contentElement?.classList.remove('fade-transition');
      [eventIcon, eventYear, eventCompany, eventDescription].forEach(el => 
        el?.classList.remove('fade-out')
      );
      contentElement?.classList.add('fade-in');
      
      isAnimating = false;
    };

    contentElement?.addEventListener('animationend', handleFadeOut, { once: true });
  };

  const handleSliderInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const index = parseInt(target.value);
    updateTimeline(index);
  };

  const startAutoPlay = () => {
    if (autoPlayInterval) stopAutoPlay();
    
    autoPlayInterval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= timelineData.length) {
        nextIndex = 0;
      }
      updateTimeline(nextIndex);
    }, 4000);
  };

  const stopAutoPlay = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  };

  const handleUserInteraction = () => {
    stopAutoPlay();
    
    if (userInteractionTimeout) {
      clearTimeout(userInteractionTimeout);
    }
    
    userInteractionTimeout = setTimeout(startAutoPlay, 5000);
  };

  onMount(() => {
    setTimeout(startAutoPlay, 2000);
  });

  onDestroy(() => {
    stopAutoPlay();
    if (userInteractionTimeout) {
      clearTimeout(userInteractionTimeout);
    }
  });
</script>

<section class=" section section-azul timeline-section">
  <div class="timeline-container">
    <div class="timeline-header">
      <h1 class="timeline-title">Historia</h1>
    </div>

    <div class="timeline-content" bind:this={contentElement}>

      <div class="event-year" bind:this={eventYear}>{currentEvent.year}</div>
      <div class="event-company" bind:this={eventCompany}>{currentEvent.company}</div>
      <div class="event-description" bind:this={eventDescription}>
        {currentEvent.description}
      </div>
    </div>

    <div class="slider-container">
      <div class="slider-track">
        <div class="progress-fill" bind:this={progressFill} style="width: {progress}%"></div>
        {#each timelineData as _, index}
          <div 
            class="tick {index === currentIndex ? 'active' : ''}" 
            style="left: calc({(index / (timelineData.length - 1)) * 100}%)"
          ></div>
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
    --cnu-red: var(--action-red);
    --cnu-gold: var(--action-yellow);

    /* Aplicaciones de color */
    --primary-light: var(--action-yellow);
    --primary: var(--action-yellow);
    --primary-dark: var(--action-red);
    --accent: var(--action-blue);
    --accent-dark: var(--action-blue);
    --highlight: var(--cnu-red);

    /* Fondos y textos */
    --background: #ffffff;
    --foreground: #1e293b;
    --text-muted: #465c7f;
    --border-color: #e2e8f0;
    --card-bg: rgba(255, 255, 255, 0.95);

    /* Espaciado */
    --max-width: 1200px;
    --padding-x: 32px;

    /* Tipografía */
    --font-family-base: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    --title-size-desktop: 3rem;
    --title-size-mobile: 2rem;
    --subtitle-size: 1.5rem;
    --description-size: 1.1rem;
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .section {
  background:
    radial-gradient(circle at top left, rgba(250, 215, 51, 0.24), transparent 32%),
    radial-gradient(circle at bottom right, rgba(226, 33, 54, 0.2), transparent 30%),
    var(--action-blue);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--foreground);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.5;
  }

  .timeline-container {
    background: var(--card-bg);
    border-radius: 20px;
    padding: 4rem 3rem;
    max-width: 900px;
    width: 100%;
    box-shadow: 0 20px 25px -5px rgba(37, 64, 107, 0.18),
      0 10px 10px -5px rgba(37, 64, 107, 0.08);
    text-align: center;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(250, 215, 51, 0.22);
    backdrop-filter: blur(10px);
  }

  .timeline-header {
    margin-bottom: 3rem;
  }

  .timeline-title {
    font-size: var(--title-size-desktop);
    font-weight: 700;
    margin-bottom: 0.5rem;
    opacity: 0;
    animation: fadeInUpTitle 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    color: var(--foreground);
    letter-spacing: -0.025em;
  }

  .timeline-subtitle {
    font-size: var(--subtitle-size);
    font-weight: 400;
    opacity: 0;
    animation: fadeInUpTitle 1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards;
    color: var(--text-muted);
    letter-spacing: 0.025em;
  }

  @keyframes fadeInUpTitle {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .timeline-content {
    margin-bottom: 4rem;
    min-height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .event-icon {
    width: 72px;
    height: 72px;
    background: linear-gradient(135deg, var(--action-yellow), var(--action-red));
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    margin-bottom: 2rem;
    color: white;
    box-shadow: 0 10px 25px rgba(226, 33, 54, 0.18);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .event-year {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: var(--action-blue);
    letter-spacing: -0.05em;
  }

  .event-company {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    color: var(--action-red);
    letter-spacing: -0.025em;
  }

  .event-description {
    font-size: var(--description-size);
    font-weight: 400;
    max-width: 550px;
    line-height: 1.7;
    color: var(--foreground);
    letter-spacing: 0.015em;
    opacity: 0.8;
  }

  .slider-container {
    position: relative;
    margin: 3rem 0 0 0;
    padding: 0 1rem;
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
    top: 0;
    left: 0;
    height: 6px;
    background: linear-gradient(90deg, var(--action-yellow), var(--cnu-coral), var(--action-red));
    border-radius: 8px;
    width: 0%;
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
    height: 30px;
    font-size: 0.875rem;
    color: var(--text-muted);
    font-weight: 500;
    user-select: none;
    letter-spacing: 0.025em;
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
    text-shadow: 0 0 8px rgba(226, 33, 54, 0.2);
  }

  .timeline-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    background: transparent;
    outline: none;
    position: absolute;
    top: 4px;
    left: 0;
    margin: 0;
    cursor: pointer;
    z-index: 10;
  }

  .timeline-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: white;
    border: 3px solid var(--action-red);
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(226, 33, 54, 0.22);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-top: -8px;
    position: relative;
    z-index: 2;
  }

  .timeline-slider::-webkit-slider-thumb:hover {
    transform: scale(1.15);
    box-shadow: 0 6px 20px rgba(226, 33, 54, 0.28),
      0 0 0 8px rgba(250, 215, 51, 0.18);
    border-color: var(--action-yellow);
  }

  .timeline-slider::-webkit-slider-thumb:active {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(226, 33, 54, 0.3),
      0 0 0 4px rgba(250, 215, 51, 0.18);
  }

  .timeline-slider::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: white;
    border: 3px solid var(--action-red);
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(226, 33, 54, 0.22);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 2;
  }

  .timeline-slider::-moz-range-thumb:hover {
    transform: scale(1.15);
    box-shadow: 0 6px 20px rgba(226, 33, 54, 0.28);
    border-color: var(--action-yellow);
  }

  .fade-transition {
    animation: fadeOutDown 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .fade-in {
    animation: fadeInUpContent 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .event-icon.fade-out,
  .event-year.fade-out,
  .event-company.fade-out,
  .event-description.fade-out {
    animation: fadeOutDown 0.3s ease-in-out forwards;
  }

  @keyframes fadeOutDown {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(20px);
    }
  }

  @keyframes fadeInUpContent {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* Media queries */
  @media (max-width: 768px) {
    .section {
      padding: 1rem;
    }

    .timeline-container {
      padding: 2.5rem 2rem;
      margin: 0;
      border-radius: 16px;
    }

    .timeline-title {
      font-size: var(--title-size-mobile);
    }

    .timeline-subtitle {
      font-size: 1rem;
    }

    .event-year {
      font-size: 2.5rem;
    }

    .event-company {
      font-size: 1.25rem;
    }

    .event-description {
      font-size: 1rem;
    }

    .event-icon {
      width: 60px;
      height: 60px;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .timeline-content {
      min-height: 280px;
      margin-bottom: 3rem;
    }

    .slider-container {
      padding: 0 0.5rem;
    }

    .year-labels {
      font-size: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    .timeline-container {
      padding: 2rem 1.5rem;
      padding-bottom: 3.5rem;
    }

    .timeline-title {
      font-size: 1.75rem;
    }

    .event-year {
      font-size: 2rem;
    }

    .year-labels {
      font-size: 0.7rem;
    }
  }
</style>
