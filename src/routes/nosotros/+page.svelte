<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import Counter from '$lib/components/nosotros/Count.svelte';
  import TextRotator from '$lib/components/nosotros/TextRotator.svelte';
  import { onMount } from 'svelte';

  let isMounted = false;
  let activeTestimonial = 0;

  onMount(() => {
    isMounted = true;
    // Auto-rotar testimonios cada 5s
    const interval = setInterval(() => {
      activeTestimonial = (activeTestimonial + 1) % testimonials.length;
    }, 5000);
    return () => clearInterval(interval);
  });

  // PALETA OFICIAL CNU
  const PALETA = {
    amarillo: 'var(--cnu-yellow)',
    coral:    'var(--cnu-coral)',
    azul:     'var(--cnu-blue)'
  };

  const flipWords = [
    { text: "crea valor",      color: PALETA.azul    },
    { text: "genera impacto",  color: PALETA.coral   },
    { text: "impulsa ideas",   color: PALETA.amarillo }
  ];

  const stats = [
    { value: 15,  suffix: '+', label: 'Proyectos', color: PALETA.coral    },
    { value: 500, suffix: '+', label: 'Miembros',  color: PALETA.amarillo },
    { value: 10,  suffix: '',  label: 'Aliados',   color: PALETA.azul     }
  ];

  const features = [
    { title: 'Rigor Técnico', desc: 'Representa la base sobre la cual se desarrollan todos los proyectos. No se trata únicamente de generar ideas atractivas, sino de sustentarlas con conocimiento sólido, metodologías de ingeniería y análisis estructurado. Cada iniciativa se aborda con una mentalidad analítica, donde se evalúan variables, se modelan escenarios y se optimizan soluciones.',       color: PALETA.azul,     isLarge: true  },
    { title: 'ADN UNAM',      desc: 'Refleja la esencia y los valores que provienen de una de las instituciones académicas más importantes de América Latina. Este ADN no solo implica pertenencia, sino también un compromiso con la excelencia, la ética profesional y la responsabilidad social.',     color: PALETA.amarillo, isLarge: false },
    { title: 'Ejecución',     desc: 'Esto implica procesos claros: desde la validación de una idea, el diseño de un modelo de negocio, la creación de prototipos, hasta la implementación y mejora continua.',          color: PALETA.coral,    isLarge: false }
  ];

  const pillars = [
    {
      label: 'Misión',
      color: PALETA.coral,
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>`,
      text: 'Fomentar y apoyar el emprendimiento para contribuir a la innovación y el crecimiento dentro de la UNAM, su comunidad y sus alrededores, ofreciendo el acompañamiento necesario para llevar ideas a la práctica.'
    },
    {
      label: 'Visión',
      color: PALETA.azul,
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
      text: 'Ser la organización líder en materia de emprendimiento dentro de la Universidad, fungiendo como el principal precedente de emprendedores exitosos.'
    }
  ];

  const testimonials = [
    { quote: 'En el CNU aprendí el valor real del trabajo en equipo y la importancia de una buena organización.', author: 'Tamal de Mole', year: '2025' },
    { quote: 'En el CNU aprendí que una persona puede hacer muchas cosas por sí sola, pero nada se compara con lo que se puede lograr acompañado de personas que coinciden con tus intereses.', author: 'Alejandro Mora', year: '2025' }
  ];
</script>

{#if isMounted}
<main class="about-page">

  <div class="bg-decoration" aria-hidden="true">
    <div class="grid-overlay"></div>
    <div class="glow-orb glow-1"></div>
    <div class="glow-orb glow-2"></div>
  </div>

  <div class="container">

    <!-- ── HERO ── -->
    <header class="hero">
      <div in:fly={{ y: 20, duration: 600 }}>
        <h1 class="title-tight">
          Ingeniería que <br class="mobile-break" />
          <TextRotator items={flipWords} />
        </h1>
        <p class="description">
          Unimos la excelencia académica con la agilidad del ecosistema emprendedor.
        </p>
      </div>
    </header>

    <!-- ── STATS ── -->
    <section class="stats-grid">
      {#each stats as stat}
        <div class="stat-card" style="border-bottom: 6px solid {stat.color} !important;">
          <div class="stat-value">
            <Counter target={stat.value} suffix={stat.suffix} />
          </div>
          <p class="stat-label">{stat.label}</p>
        </div>
      {/each}
    </section>

    <!-- ── BENTO FEATURES ── -->
    <section class="bento-grid">
      {#each features as f, i}
        <div
          class="bento-card"
          class:large={f.isLarge}
          style="border: 3px solid {f.color} !important;"
          in:fly={{ y: 30, delay: 500 + (i * 100) }}
        >
          <div class="card-content">
            <h3 class="card-title">{f.title}</h3>
            <p class="card-desc">{f.desc}</p>
          </div>
        </div>
      {/each}
    </section>

    <!-- ── MISIÓN & VISIÓN ── -->
    <section class="pillars-section" in:fly={{ y: 30, duration: 600, delay: 200 }}>
      <div class="section-label">
        <span class="label-dot" style="background: var(--cnu-coral)"></span>
        Quiénes somos
      </div>
      <p class="pillars-intro" >
        El Centro de Negocios Universitario es una agrupación estudiantil que constantemente busca innovar en nuevos proyectos, con el objetivo de que los miembros desarrollen y fortalezcan habilidades blandas y duras, creciendo en el aspecto personal, profesional y académico.
      </p>
      <div class="pillars-grid">
        {#each pillars as p}
          <div class="pillar-card" style="--accent: {p.color}">
            <div class="pillar-icon">
              {@html p.icon}
            </div>
            <span class="pillar-label">{p.label}</span>
            <p class="pillar-text">{p.text}</p>
          </div>
        {/each}
      </div>
    </section>

    <!-- ── NEGOCIOS EN LA COMUNIDAD ── -->
    <section class="community-section" in:fly={{ y: 30, duration: 600, delay: 300 }}>
      <div class="community-inner">
        <div class="community-badge" style="color: var(--cnu-blue); border-color: var(--cnu-blue)">
          ¡HEY, EMPRENDAMOS!
        </div>
        <h2 class="community-title">Negocios en la<br/><em style="color: var(--cnu-coral)">Comunidad Universitaria</em></h2>
        <p class="community-body">
          La universidad es el único momento en que tienes tiempo, recursos y libertad para equivocarte sin que te cueste una fortuna. El emprendimiento y los negocios te enseñan a crear valor y a no depender de nadie; las actividades extracurriculares te dan liderazgo y una red que ningún título iguala.
        </p>
        <p class="community-body community-highlight" style="border-left: 4px solid var(--cnu-coral)">
          Juntos te convierten en el profesionista que todos quieren contratar… o en quien los contrata. <strong>Aprovéchalo ahora.</strong>
        </p>
      </div>
    </section>

    <!-- ── IMPACTO / TESTIMONIOS ── -->
    <section class="impact-section" in:fly={{ y: 30, duration: 600, delay: 400 }}>
      <div class="section-label">
        <span class="label-dot" style="background: var(--cnu-blue)"></span>
        Impacto
      </div>

      <div class="testimonial-wrapper">
        <button
          class="t-arrow t-arrow-left"
          aria-label="Testimonio anterior"
          on:click={() => activeTestimonial = (activeTestimonial - 1 + testimonials.length) % testimonials.length}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M10 12L6 8L10 4"/></svg>
        </button>

        <div class="testimonial-track">
          {#key activeTestimonial}
            <div class="testimonial-card" in:fade={{ duration: 300 }}>
              <span class="quote-mark" style="color: var(--cnu-coral)">"</span>
              <p class="quote-text">{testimonials[activeTestimonial].quote}</p>
              <div class="quote-author">
                <span class="author-name">{testimonials[activeTestimonial].author}</span>
                <span class="author-year" style="color: var(--cnu-coral)">{testimonials[activeTestimonial].year}</span>
              </div>
            </div>
          {/key}
        </div>

        <button
          class="t-arrow t-arrow-right"
          aria-label="Siguiente testimonio"
          on:click={() => activeTestimonial = (activeTestimonial + 1) % testimonials.length}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M6 4L10 8L6 12"/></svg>
        </button>
      </div>

      <!-- Dots -->
      <div class="t-dots">
        {#each testimonials as _, i}
          <button
            class="t-dot {activeTestimonial === i ? 'active' : ''}"
            style={activeTestimonial === i ? 'background: var(--cnu-coral)' : ''}
            on:click={() => activeTestimonial = i}
            aria-label={"Ver testimonio " + (i + 1)}
          ></button>
        {/each}
      </div>
    </section>

  </div>
</main>
{/if}

<style>
  /* ── Base ── */
  .about-page {
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

  /* ── Fondo decorativo ── */
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

  /* ── Hero ── */
  .hero { text-align: center; margin-bottom: 80px; }
  .title-tight {
    font-size: clamp(2.5rem, 8vw, 4.5rem);
    font-weight: 800;
    line-height: 1.1;
    color: var(--action-blue);
    letter-spacing: -2px;
  }
  .description {
    font-size: 1.2rem;
    color: #666;
    max-width: 600px;
    margin: 2rem auto 0;
  }
  .mobile-break { display: none; }

  /* ── Stats ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 80px;
  }
  .stat-card {
    background: #fff;
    border: 1px solid #eee;
    padding: 40px 20px;
    border-radius: 24px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  }
  .stat-value { font-size: 3.5rem; font-weight: 800; color: var(--action-blue); }
  .stat-label { font-size: 0.85rem; font-weight: 700; color: #999; text-transform: uppercase; margin-top: 8px; }

  /* ── Bento ── */
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 80px;
  }
  .bento-card {
    background: #fff;
    padding: 40px;
    border-radius: 32px;
    min-height: 240px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    transition: transform 0.3s ease;
  }
  .bento-card:hover { transform: translateY(-8px); }
  .large { grid-column: span 2; }
  .card-title { font-size: 2.2rem; font-weight: 800; color: var(--action-blue); margin-bottom: 10px; }
  .card-desc { font-size: 1.2rem; color: #555; line-height: 1.5; }

  /* ── Section label ── */
  .section-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #999;
    margin-bottom: 1.5rem;
  }
  .label-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* ── Pillars (Misión/Visión) ── */
  .pillars-section {
    margin-bottom: 80px;
  }
  .pillars-intro {
    font-size: 1.15rem;
    color: #444;
    line-height: 1.75;
    margin-bottom: 2.5rem;
  }
  .pillars-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  .pillar-card {
    background: #fff;
    border: 1.5px solid #eee;
    border-top: 5px solid var(--accent);
    border-radius: 20px;
    padding: 32px;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .pillar-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.07);
  }
  .pillar-icon {
    width: 36px; height: 36px;
    color: var(--accent);
    margin-bottom: 1rem;
  }
  .pillar-icon :global(svg) { width: 100%; height: 100%; }
  .pillar-label {
    display: block;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 0.75rem;
  }
  .pillar-text {
    font-size: 1rem;
    color: #555;
    line-height: 1.7;
    margin: 0;
  }

  /* ── Community ── */
  .community-section {
    background: #f8f7f4;
    border-radius: 32px;
    padding: 64px 56px;
    margin-bottom: 80px;
  }
  .community-badge {
    display: inline-block;
    border: 1.5px solid;
    border-radius: 100px;
    padding: 6px 18px;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
  }
  .community-title {
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 800;
    color: var(--action-blue);
    letter-spacing: -1.5px;
    line-height: 1.1;
    margin: 0 0 1.75rem;
  }
  .community-body {
    font-size: 1.05rem;
    color: #555;
    line-height: 1.75;
    max-width: 720px;
    margin: 0 0 1.25rem;
  }
  .community-highlight {
    padding-left: 1.25rem;
    color: #333;
    font-size: 1.05rem;
  }

  /* ── Testimonios ── */
  .impact-section { margin-bottom: 60px; }
  .testimonial-wrapper {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .testimonial-track { flex: 1; }
  .testimonial-card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 24px;
    padding: 40px 44px;
    position: relative;
    box-shadow: 0 8px 24px rgba(0,0,0,0.04);
    min-height: 180px;
  }
  .quote-mark {
    font-size: 5rem;
    line-height: 1;
    font-family: Georgia, serif;
    position: absolute;
    top: 12px; left: 28px;
    opacity: 0.25;
  }
  .quote-text {
    font-size: 1.1rem;
    color: #333;
    line-height: 1.7;
    margin: 1.5rem 0 1.25rem;
    font-style: italic;
  }
  .quote-author {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.85rem;
  }
  .author-name { font-weight: 700; color: var(--action-blue); }
  .author-year { font-weight: 600; }

  .t-arrow {
    width: 40px; height: 40px;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: background 0.2s, border-color 0.2s;
    color: var(--action-blue);
  }
  .t-arrow:hover { background: #f5f5f5; border-color: #bbb; }

  .t-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 20px;
  }
  .t-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #ddd;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: background 0.25s, width 0.25s;
  }
  .t-dot.active { width: 22px; border-radius: 100px; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .stats-grid          { grid-template-columns: 1fr; }
    .bento-grid          { grid-template-columns: 1fr; }
    .large               { grid-column: span 1; }
    .pillars-grid        { grid-template-columns: 1fr; }
    .mobile-break        { display: block; }
    .title-tight         { font-size: 2.8rem; }
    .community-section   { padding: 40px 28px; }
    .testimonial-card    { padding: 32px 28px; }
    .t-arrow             { display: none; }
  }
</style>