<script lang="ts">
  export let project: any;
  export let showModal: boolean;
  let dialog: HTMLDialogElement;

  $: if (dialog && showModal) dialog.showModal();
</script>

<dialog
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:click|self={() => dialog.close()}
>
  <div class="modal-content">
    <button class="close-btn" on:click={() => dialog.close()}>×</button>
    
    {#if project.imageUrl}
      <img src={project.imageUrl} alt={project.title} class="modal-banner" />
    {/if}

    <div class="modal-body">
      <span class="tag">Proyecto 2026</span>
      <h2>{project.title}</h2>
      <div class="description-full">
        <strong>Resumen:</strong>
        <p>{project.description}</p>
      </div>
      <div class="content-full">
        <strong>Detalle del Proyecto:</strong>
        <p>{project.content || 'Sin contenido adicional disponible.'}</p>
      </div>
    </div>
  </div>
</dialog>

<style>
  dialog {
    border: none;
    border-radius: 16px;
    padding: 0;
    max-width: 700px;
    width: 90%;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
  dialog::backdrop { background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); }
  
  .modal-content { position: relative; overflow: hidden; }
  .close-btn {
    position: absolute; top: 10px; right: 15px;
    background: white; border: none; font-size: 2rem;
    cursor: pointer; z-index: 10; border-radius: 50%; width: 40px; height: 40px;
  }

  .modal-banner { width: 100%; height: 250px; object-fit: cover; }
  .modal-body { padding: 2rem; display: flex; flex-direction: column; gap: 1rem; }
  
  .tag { color: var(--cnu-coral); font-weight: bold; text-transform: uppercase; font-size: 0.8rem; }
  h2 { margin: 0; font-size: 2rem; }
  h2 { color: var(--action-blue); }
  strong { display: block; margin-bottom: 0.5rem; color: var(--action-blue); }
  p { line-height: 1.6; color: #444; margin-bottom: 1rem; }
</style>
