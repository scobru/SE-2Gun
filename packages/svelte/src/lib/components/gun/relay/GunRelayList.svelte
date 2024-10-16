<script lang="ts">
    import { onMount } from 'svelte';
    import { useRelay } from '$lib/gun/relay';
    import { useRelays } from '$lib/gun/relays';
  
    const { relay, setPeer, resetPeer } = useRelay();
    const { relays, loadRelays } = useRelays();
  
    onMount(() => {
      loadRelays();
    });
  </script>
  
  <div class="flex flex-col">
    <div class="flex items-center">
      <div class="text-lg text-left">Volunteer relay peers:</div>
      <div class="flex-auto"></div>
      <button class="button m-1" on:click={loadRelays}>
        <div class="i-la-redo-alt"></div>
      </button>
    </div>
    <ul class="flex flex-col font-normal items-start">
      {#each Object.entries($relays) as [host, link] (host)}
        <li 
          class="flex w-full text-left p-1 hover:bg-light-500 cursor-pointer hover:dark:bg-gray-600"
          class:active={link.url === $relay.peer}
          style="order: {link.ping}"
          on:click={() => setPeer(link.url)}
        >
          <div class="flex-1 underline">{link.host}</div>
          <div class="font-bold">{link.ping} ms</div>
        </li>
      {/each}
    </ul>
  </div>
  
  <style lang="postcss">
    .active {
      @apply text-lg bg-gray-900 font-bold dark:bg-gray-700;
    }
  </style>