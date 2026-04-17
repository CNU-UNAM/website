<script lang="ts">
  export let item: any;
  export let index: number;

  // Hardcoded tokens del manual de estilo para evitar cálculos de JS
  const colors = ['#AAC5FF', '#FF837D', '#FFF389'];
  const accent = colors[index % colors.length];
</script>

<div class="project-card" style="--card-accent: {accent}">
  <div class="image-container">
    {#if item.imageUrl}
      <img 
        src={item.imageUrl} 
        alt={item.title} 
        loading="lazy" 
        decoding="async"
      />
    {:else}
      <div class="placeholder">CNU</div>
    {/if}
  </div>

  <div class="card-body">
    <h3 class="card-title">{item.title}</h3>
    <p class="card-text">{item.description || item.content || ''}</p>
    <a href="/proyectos/{item.id}" class="card-link">Explorar</a>
  </div>
</div>

<style>
  .project-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #eee;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    /* Quitamos animaciones complejas de entrada para probar fluidez */
    transition: transform 0.2s ease;
  }

  .project-card:hover {
    transform: translateY(-4px);
    border-color: var(--card-accent);
  }

  .image-container {
    aspect-ratio: 16 / 9;
    background: #f8f8f8;
    border-bottom: 4px solid var(--card-accent);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .card-body {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .card-title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: #171717;
  }

  .card-text {
    font-size: 0.9rem;
    color: #666;
    line-height: 1.5;
    margin-bottom: 1rem;
    /* Limitamos el texto para no saturar el renderizado */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-link {
    margin-top: auto;
    font-weight: bold;
    color: #171717;
    text-decoration: underline;
    text-underline-offset: 4px;
  }
</style>