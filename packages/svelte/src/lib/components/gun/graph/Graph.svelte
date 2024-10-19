<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { useGun } from '$lib/gun/gun';
  import AccountAvatar from '../account/AccountAvatar.svelte';
  import { useColor } from '$lib/gun/colors';
  import { fade } from 'svelte/transition';
  import { browser } from '$app/environment';

  let colorDeep;
  
  if(browser) {
    colorDeep = useColor("deep");
  }
  let graph = {};
  let gun = useGun();

  function updateGraph() {
    graph = { ...gun._.graph };
  }

  let timer;

  onMount(() => {
    updateGraph();
    timer = setInterval(updateGraph, 1000);
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });

  function toggleShow(node) {
    node.show = !node.show;
    graph = graph;
  }

  function formatValue(value) {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return value;
  }
</script>

<article class="overflow-hidden bg-ableton-beige m-4 p-10 rounded-none break-all text-white">
<h2 class="card-title font-medium text-2xl mb-4 text-black">User Graph</h2>

{#each Object.entries(graph).filter(([id, _]) => !id.startsWith('undefined')) as [id, node]}
  <div 
    class="p-2 text-sm w-full text-white" 
    style="background-color: {colorDeep.hex(id)};"
  >
    <div class="flex cursor-pointer" on:click={() => toggleShow(node)}>
      {#if id[0] === '~'}
        <AccountAvatar pub={id.slice(1, 88)} size={20} />
      {/if}
      <div class="item font-bold">{id[0] === '~' ? id.slice(88) : id}</div>
    </div>
    {#if node.show}
      <section transition:fade>
        {#each Object.entries(node) as [key, value]}
          {#if key !== '_' && key !== 'show'}
            <div class="p-2 border-t border-gray-700">
              <div class="font-semibold text-blue-400">{key}</div>
              <pre class="whitespace-pre-wrap break-words text-xs">{formatValue(value)}</pre>
            </div>
          {/if}
        {/each}
      </section>
    {/if}
  </div>
{/each}
</article>

<style>
pre {
  max-height: 200px;
  overflow-y: auto;
}
</style>