<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';

  let visible = false;
  onMount(() => visible = true);
</script>

{#if visible}
<section class="hero" in:fade={{ duration: 800 }}>
  <div class="blur-circle yellow" style="top: 5%; left: -10%; width: 50vw; opacity: 0.2;"></div>
  <div class="blur-circle blue" style="bottom: 10%; right: -10%; width: 40vw; opacity: 0.15;"></div>

  <div class="container hero-container">
    <div class="content-layout">
      
      <header class="text-side">
        <h1 class="mega-title" in:fly={{ y: 20, duration: 800 }}>
          Las ideas nacen aquí. <br />
          <span class="highlight">Los proyectos crecen contigo.</span>
        </h1>

        <p class="main-text" in:fly={{ y: 20, duration: 800, delay: 200 }}>
          Somos una comunidad de estudiantes dedicada a transformar el entorno universitario. 
          Aquí no solo desarrollas <strong>proyectos con impacto real</strong>, sino que fortaleces las habilidades que te formarán como profesional.
        </p>

        <div class="action-area" in:fly={{ y: 20, duration: 800, delay: 400 }}>
          <a href="/vacantes" class="btn btn-primary">Ver vacantes abiertas</a>
          <a href="/contacto" class="btn btn-outline">Contactar con nosotros</a>
        </div>
      </header>

      <div class="visual-side" in:fade={{ duration: 1000, delay: 600 }}>
        <div class="image-frame">
          <img src="/images/team-cnu.webp" alt="Estudiantes CNU colaborando" class="hero-img" />
          <span class="image-caption">Nuestros miembros en la última jornada de innovación.</span>
        </div>
      </div>

    </div>
  </div>
</section>
{/if}

<style>
  @import "./Hero.css";
</style>