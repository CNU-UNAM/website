<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { backOut } from 'svelte/easing';

  export let items: { text: string; color: string }[] = [];
  let index = 0;

  onMount(() => {
    const interval = setInterval(() => {
      index = (index + 1) % items.length;
    }, 3000);
    return () => clearInterval(interval);
  });
</script>

<span class="rotator-wrapper">
  <span class="placeholder" aria-hidden="true">
    {#each items as item}
      <span class="ghost-word">{item.text}</span>
    {/each}
  </span>

  {#key index}
    <span 
      class="word" 
      style="color: {items[index].color} !important;" 
      in:fly={{ y: 25, duration: 700, easing: backOut }}
      out:fly={{ y: -25, duration: 500 }}
    >
      {items[index].text}
    </span>
  {/key}
</span>

<style>
  .rotator-wrapper {
    display: inline-grid;
    grid-template-areas: "stack";
    position: relative;
    vertical-align: middle;
    overflow: hidden;
  }
  .placeholder { grid-area: stack; display: flex; flex-direction: column; visibility: hidden; height: 0; }
  .ghost-word { height: 0; overflow: hidden; font-weight: 800; }
  .word {
    grid-area: stack;
    display: inline-block;
    font-weight: 800;
    white-space: nowrap;
    z-index: 2;
  }
</style>