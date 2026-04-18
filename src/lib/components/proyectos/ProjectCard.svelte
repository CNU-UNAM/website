<script lang="ts">
  export let item: any;
  export let index: number;

  const colors = ['var(--cnu-yellow)', 'var(--cnu-coral)', 'var(--cnu-blue)'];
  const accent = colors[index % colors.length];
</script>

<div class="project-card" style="--card-accent: {accent}">
  <div class="card-body">
    {#if item.imageUrl}
      <div class="image-container">
        <img
          src={item.imageUrl}
          alt={item.title}
          loading="lazy"
          decoding="async"
        />
      </div>
    {/if}

    <h3 class="card-title">{item.title}</h3>
    <p class="card-text">{item.description || item.content || ''}</p>
    <a href="/proyectos/{item.id}" class="card-link">Explorar</a>
  </div>
</div>

<style>
  .project-card {
    background: #fff;
    border-radius: 32px;
    border: 3px solid var(--card-accent);
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 320px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  }

  .project-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
  }

  .image-container {
    aspect-ratio: 16 / 9;
    background: #f7f7f7;
    border-radius: 22px;
    overflow: hidden;
    margin-bottom: 1.5rem;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .card-body {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: flex-end;
  }

  .card-title {
    font-size: 2rem;
    line-height: 1.1;
    margin-bottom: 0.75rem;
    color: var(--action-blue);
    font-weight: 800;
  }

  .card-text {
    font-size: 1rem;
    color: #555;
    line-height: 1.5;
    margin-bottom: 1.25rem;
    line-clamp: 3;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-link {
    margin-top: auto;
    font-weight: 700;
    color: var(--action-blue);
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  @media (max-width: 768px) {
    .project-card {
      min-height: auto;
      border-radius: 28px;
    }

    .card-body {
      padding: 1.5rem;
    }

    .card-title {
      font-size: 1.6rem;
    }
  }
</style>
