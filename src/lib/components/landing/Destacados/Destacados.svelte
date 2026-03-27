<script lang="ts">
  import Carousel from "$lib/components/Carousel/Carousel.svelte";
</script>

<section class="section-blanca">
  <div class="container">
    <h2 class="title">Proyectos Destacados</h2>

    <Carousel
      tableName="projects"
      bucketName="imagenes" 
    />
  </div>
</section>

<style>
 @import "./Destacados.css";
</style>