<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import Counter from '$lib/components/nosotros/Count.svelte';
  import TextRotator from '$lib/components/nosotros/TextRotator.svelte';
  import { onMount } from 'svelte';

  let isMounted = false;
  onMount(() => { isMounted = true; });

  // PALETA OFICIAL CNU (HARDCODED PARA SEGURIDAD)
  const PALETA = {
    amarillo: 'var(--cnu-yellow)',
    coral: 'var(--cnu-coral)',
    azul: 'var(--cnu-blue)'
  };

  const flipWords = [
    { text: "crea valor", color: PALETA.azul },
    { text: "genera impacto", color: PALETA.coral },
    { text: "impulsa ideas", color: PALETA.amarillo }
  ];

  const stats = [
    { value: 15, suffix: '+', label: 'Proyectos', color: PALETA.coral },
    { value: 500, suffix: '+', label: 'Miembros', color: PALETA.amarillo },
    { value: 10, suffix: '', label: 'Aliados', color: PALETA.azul }
  ];

  const features = [
    { title: 'Rigor Técnico', desc: 'Ingeniería real aplicada a negocios.', color: PALETA.azul, isLarge: true },
    { title: 'ADN UNAM', desc: 'Orgullosamente Facultad de Ingeniería.', color: PALETA.amarillo, isLarge: false },
    { title: 'Ejecución', desc: 'De la idea al prototipo funcional.', color: PALETA.coral, isLarge: false }
  ];
</script>

{#if isMounted}
<main class="about-page">
  <div class="container">
    
    <header class="hero">
      <div in:fly={{ y: 20, duration: 800 }}>
        <span class="eyebrow" style="color: {PALETA.coral}">Nosotros</span>
        <h1 class="title-tight">
          Ingeniería que <br class="mobile-break" />
          <TextRotator items={flipWords} />
        </h1>
        <p class="description">
          Unimos la excelencia académica con la agilidad del ecosistema emprendedor.
        </p>
      </div>
    </header>

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

  </div>
</main>
{/if}

<style>
  .about-page {
    padding: 80px 0;
    background-color: #ffffff;
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .hero { text-align: center; margin-bottom: 80px; }

  .eyebrow {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    display: block;
  }

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

  /* STATS */
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

  /* BENTO */
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
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

  .mobile-break { display: none; }

  @media (max-width: 768px) {
    .stats-grid { grid-template-columns: 1fr; }
    .bento-grid { grid-template-columns: 1fr; }
    .large { grid-column: span 1; }
    .mobile-break { display: block; }
    .title-tight { font-size: 2.8rem; }
  }
</style>
