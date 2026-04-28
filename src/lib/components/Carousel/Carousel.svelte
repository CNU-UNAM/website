<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';

  export let tableName: string;
  export let bucketName: string;

  interface Item {
    id: string | number;
    title: string;
    description: string;
    content: string;
    image_path?: string | null;
    imageUrl?: string | null;
  }

  let items: Item[] = [];
  let loading = true;
  let error: string | null = null;

  let carouselContainer: HTMLElement | undefined;
  let canScrollLeft = false;
  let canScrollRight = false;
  let currentIndex = 0;

  onMount(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select('id, title, description, content, image_path')
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      items = (data || []).map((item: any) => ({
        ...item,
        imageUrl: item.image_path?.startsWith('http')
          ? item.image_path
          : item.image_path
          ? supabase.storage.from(bucketName).getPublicUrl(item.image_path).data.publicUrl
          : null
      }));

      setTimeout(() => {
        if (carouselContainer && items.length > 0) {
          const mid = Math.floor(items.length / 2);
          currentIndex = mid;
          carouselContainer.scrollLeft = mid * getCardWidth();
        }
        updateScrollButtons();
      }, 100);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error desconocido';
    } finally {
      loading = false;
    }
  });

  function getCardWidth(): number {
    if (!carouselContainer) return 300;
    const firstCard = carouselContainer.querySelector('.projectCard');
    return firstCard ? firstCard.clientWidth + 20 : 300;
  }

  function updateScrollButtons() {
    canScrollLeft = true;
    canScrollRight = true;
  }

  function updateCurrentIndex() {
    if (carouselContainer && items.length > 0) {
      const cardWidth = getCardWidth();
      const scrollLeft = carouselContainer.scrollLeft;
      const newIndex = Math.round(scrollLeft / cardWidth);
      currentIndex = Math.min(Math.max(newIndex, 0), items.length - 1);
    }
  }

  function handleScroll() {
    updateScrollButtons();
    updateCurrentIndex();
  }

  function scrollLeft() {
    if (carouselContainer) {
      if (currentIndex === 0) {
        const last = items.length - 1;
        currentIndex = last;
        carouselContainer.scrollLeft = last * getCardWidth();
      } else {
        carouselContainer.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
      }
    }
  }

  function scrollRight() {
    if (carouselContainer) {
      if (currentIndex === items.length - 1) {
        currentIndex = 0;
        carouselContainer.scrollLeft = 0;
      } else {
        carouselContainer.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
      }
    }
  }

  function goToSlide(index: number) {
    if (carouselContainer) {
      carouselContainer.scrollTo({
        left: index * getCardWidth(),
        behavior: 'smooth'
      });
    }
  }
</script>

{#if loading}
  <p class="loading">Cargando proyectos...</p>
{:else if error}
  <p class="error">Error: {error}</p>
{:else if items.length === 0}
  <p class="empty">No hay proyectos disponibles.</p>
{:else}
  <div class="carousel-wrapper">
    <!-- Botón anterior -->
    <button
      class="carousel-btn prev"
      on:click={scrollLeft}
      disabled={!canScrollLeft}
      aria-label="Anterior"
    >
      ‹
    </button>

    <div class="carousel-container">
      <div
        class="projectsGrid"
        bind:this={carouselContainer}
        on:scroll={handleScroll}
      >
        {#each items as item (item.id)}
          <div class="projectCard">
            <div class="polaroid">
              <div class="imageWrapper">
                {#if item.imageUrl}
                  <img
                    src={item.imageUrl}
                    alt={item.description}
                    class="projectImage"
                    loading="lazy"
                  />
                {:else}
                  <div class="imagePlaceholder">
                    <span>📷</span>
                  </div>
                {/if}
              </div>
              <div class="content">
                <h3 class="projectTitle">{item.title}</h3>
                <p class="projectDescription">{item.content}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <!-- Puntos de navegación (con etiquetas completas) -->
      {#if items.length > 1}
        <div class="dots-container">
          {#each items as _, index (index)}
            <button
              class="dot"
              class:active={currentIndex === index}
              on:click={() => goToSlide(index)}
              aria-label={`Ir al slide ${index + 1}`}
            >
              <!-- El punto se dibuja con CSS, no necesita contenido -->
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Botón siguiente -->
    <button
      class="carousel-btn next"
      on:click={scrollRight}
      disabled={!canScrollRight}
      aria-label="Siguiente"
    >
      ›
    </button>
  </div>
{/if}

<style>
  @import "./Carousel.css";
</style>