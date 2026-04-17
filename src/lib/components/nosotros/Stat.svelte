<script lang="ts">
  import { fly } from 'svelte/transition';
  export let label: string;
  export let value: string;
  export let color: string = 'var(--cnu-blue)';
</script>

<div class="stat-box" in:fly={{ y: 20, duration: 800 }}>
  <span class="value" style="color: {color}">{value}</span>
  <span class="label">{label}</span>
</div>

<style>
  .stat-box {
    text-align: center;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .value {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1;
  }
  .label {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
</style>