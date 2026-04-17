<script lang="ts">
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  export let target: number;
  export let suffix: string = "";
  
  const count = tweened(0, {
    duration: 2000,
    easing: cubicOut
  });

  onMount(() => {
    count.set(target);
  });
</script>

<span>{Math.floor($count)}{suffix}</span>