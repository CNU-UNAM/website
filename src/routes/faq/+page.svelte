<script lang="ts">
  import FAQItem from "$lib/components/faq/FAQItem.svelte";

  const faqs = [
    { category: "Comunidad", question: "¿Necesito ser de la FI para entrar?", answer: "Priorizamos a la comunidad de la Facultad de Ingeniería, pero estamos abiertos a colaboraciones multidisciplinarias de toda la UNAM." },
    { category: "Empresas", question: "¿Cómo se formaliza un patrocinio?", answer: "Mediante convenios de colaboración con Fundación UNAM para asegurar transparencia y beneficios fiscales." },
    { category: "Academia", question: "¿Tienen programa de servicio social?", answer: "Sí, contamos con programas registrados para diversas carreras de ingeniería." },
    { category: "Emprendedores", question: "¿Ayudan con el registro de marca?", answer: "Brindamos orientación inicial y vinculación con expertos en propiedad intelectual de la UNAM." }
  ];

  let query = "";
  let currentCat = "Todos";
  
  // Categorías y sus colores asignados
  const cats = [
    { name: "Todos", color: "var(--cnu-yellow)" },
    { name: "Comunidad", color: "var(--cnu-coral)" },
    { name: "Empresas", color: "var(--cnu-blue)" },
    { name: "Academia", color: "var(--cnu-yellow)" },
    { name: "Emprendedores", color: "var(--cnu-coral)" }
  ];

  $: filtered = faqs.filter(f => 
    (currentCat === "Todos" || f.category === currentCat) &&
    (f.question.toLowerCase().includes(query.toLowerCase()))
  );
</script>

<div class="faq-root">
  <div class="container main-content">
    <header class="faq-header">
      <h1 class="title">Preguntas Frecuentes</h1>
      
      <div class="search-box">
        <input type="text" placeholder="¿En qué podemos ayudarte?" bind:value={query} />
      </div>
    </header>

    <nav class="filter-nav">
      {#each cats as cat}
        <button 
          class:active={currentCat === cat.name} 
          style="--active-color: {cat.color}"
          on:click={() => currentCat = cat.name}
        >
          {cat.name}
        </button>
      {/each}
    </nav>

    <section class="faq-list">
      {#each filtered as faq, i}
        <FAQItem {...faq} colorIndex={i} />
      {/each}
      {#if filtered.length === 0}
        <p class="no-results">No hay resultados para tu búsqueda.</p>
      {/if}
    </section>

    <footer class="support-wrap">
      <div class="support-card">
        <h2>¿Dudas adicionales?</h2>
        <div class="btns">
          <a href="mailto:hola@cnu.mx" class="btn-black">Escríbenos</a>
        </div>
      </div>
    </footer>
  </div>
</div>

<style>
  .faq-root {
    background: #ffffff;
    min-height: 100vh;
    padding-top: 40px;
    position: relative;
  }

  .faq-header { text-align: center; margin-bottom: 30px; }
  
  /* Ajuste de título según app.css */
  :global(.title) { margin-bottom: 10px !important; margin-top: 0 !important; }

  .search-box { max-width: 500px; margin: 20px auto 0; }
  input {
    width: 100%;
    padding: 14px 24px;
    border-radius: 50px;
    border: 2px solid #eee;
    outline: none;
    transition: border-color 0.3s;
  }
  input:focus { border-color: var(--action-blue); }

  /* NAVEGACIÓN DE FILTROS */
  .filter-nav {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 40px;
    flex-wrap: wrap;
  }

  .filter-nav button {
    width: auto;
    min-width: fit-content;
    padding: 8px 20px;
    border-radius: 20px;
    border: 1px solid #eee;
    background: white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    color: #666;
  }

  /* Cuando el botón está activo, usa su color asignado */
  .filter-nav button.active {
    background-color: var(--active-color);
    border-color: var(--active-color);
    color: var(--action-blue);
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  }

  .faq-list { max-width: 800px; margin: 0 auto; padding: 0 20px; }

  .no-results { text-align: center; color: #999; margin-top: 40px; }

  /* SOPORTE */
  .support-wrap { margin-top: 60px; padding-bottom: 60px; }
  .support-card {
    background: linear-gradient(135deg, #f0f4ff, var(--cnu-blue));
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }
  .btn-black { 
    background: var(--action-blue); 
    color: white; 
    padding: 12px 30px; 
    border-radius: 8px; 
    text-decoration: none; 
    font-weight: bold;
    display: inline-block;
    margin-top: 15px;
  }
</style>
