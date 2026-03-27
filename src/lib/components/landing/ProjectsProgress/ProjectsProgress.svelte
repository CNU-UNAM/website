<script lang="ts">
  import Carousel from "$lib/components/Carousel/Carousel.svelte";
</script>

<section class="section">
  <div class="container">
    <h2 class="title">Proyectos en Desarrollo</h2>

    <Carousel
      tableName="projects"
      bucketName="imagenes" 
    />
  </div>
</section>

<style>
 @import "./ProjectsProgress.css";
</style>