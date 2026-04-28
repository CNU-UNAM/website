<script lang="ts">
  import Carousel from "$lib/components/Carousel/Carousel.svelte";

  let sectionEl: HTMLElement;

  function handleMouseMove(e: MouseEvent) {
    const rect = sectionEl.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    sectionEl.style.setProperty('--mx', `${x}%`);
    sectionEl.style.setProperty('--my', `${y}%`);
  }
</script>

<section
  class="section"
  bind:this={sectionEl}
  on:mousemove={handleMouseMove}
>
  <div class="container">
    <h2 class="title" data-text="Proyectos en Desarrollo">
      Proyectos en Desarrollo
    </h2>

    <Carousel
      tableName="projects"
      bucketName="imagenes"
    />
  </div>
</section>

<style>
  @import "./ProjectsProgress.css";
</style>