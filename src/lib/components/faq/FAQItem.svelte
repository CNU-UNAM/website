<script lang="ts">
  import { slide } from 'svelte/transition';
  export let question: string;
  export let answer: string;
  export let category: string;
  let isOpen = false;
</script>

<div class="faq-card" class:active={isOpen}>
  <button class="faq-btn" on:click={() => isOpen = !isOpen} aria-expanded={isOpen}>
    <div class="text-group">
      <span class="cat">{category}</span>
      <span class="q">{question}</span>
    </div>
    <div class="status-icon" class:rotated={isOpen}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    </div>
  </button>

  {#if isOpen}
    <div class="faq-body" transition:slide={{ duration: 250 }}>
      <div class="content">
        <p>{answer}</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .faq-card {
    background: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    margin-bottom: 12px;
    transition: all 0.2s ease;
  }

  .faq-card:hover {
    border-color: var(--cnu-blue);
    box-shadow: 0 4px 12px rgba(170, 197, 255, 0.1);
  }

  .faq-card.active {
    border-color: var(--cnu-blue);
    box-shadow: 0 8px 24px rgba(170, 197, 255, 0.15);
  }

  .faq-btn {
    width: 100%;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
  }

  .text-group { display: flex; flex-direction: column; gap: 4px; }

  .cat {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    color: var(--cnu-coral);
    letter-spacing: 0.05em;
  }

  .q {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--action-blue);
  }

  .status-icon {
    color: var(--cnu-blue);
    transition: transform 0.3s ease, color 0.3s ease;
    flex-shrink: 0;
  }

  .status-icon.rotated {
    transform: rotate(135deg);
    color: var(--action-blue);
  }

  .faq-body { border-top: 1px solid #f5f5f5; }

  .content { padding: 20px; }

  .content p {
    margin: 0;
    font-size: 1rem;
    line-height: 1.6;
    color: #666666;
  }
</style>
