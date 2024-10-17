<script lang="ts">
    import { useRelay } from '$lib/gun/relay';
    import { useRelays } from '$lib/gun/relays';
    import UiLayer from '../ui/UiLayer.svelte';
    import GunRelayList from './GunRelayList.svelte';
  
    export let text = '';
  
    const { relay, setPeer, resetPeer } = useRelay();
    let open = false;

    console.log($relay)
  
    const { relays, loadRelays } = useRelays();
  
    function toggleOpen() {
      open = !open;
    }
  </script>
  
  <div class="relative text-left bg-ableton-purple p-10">
    <h2 class="card-title text-black font-medium text-2xl text-white mb-5">Relays</h2>

    <button class="flex" on:click={toggleOpen}>
      <div class="btn btn-primary text-xl -mt-1 text-white">Open Relays</div>
      {#if text}
        <div class="ml-2 font-bold">{text}</div>
      {/if}
      <div
        class="p-1 bottom-0 left-2 rounded-full transition duration-300ms ease-in-out opacity-50 absolute"
        style="background-color: {$relay.blink ? 'white' : 'black'}"
      ></div>
    </button>
    
    <!-- Aggiungi questa sezione per mostrare il relay connesso -->
    {#if $relay.peer}
      <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Relay connesso: {$relay.peer}
      </div>
    {/if}
    
    <UiLayer {open} on:close={() => (open = false)}>
      <div class="p-4 min-w-60vw max-w-full">
        <div
          class="h-2 w-full mb-2 rounded-full transition-all duration-300 ease-in-out opacity-40"
          style="background-color: {$relay.blink ? 'white' : 'black'}"
        ></div>
        <div class="flex flex-col items-start">
          <div class="p-0 flex items-center flex-wrap w-full">
            Host:
            <input
              class="mx-1 p-2 rounded-lg flex-auto dark:bg-gray-800"
              bind:value={$relay.peer}
            />
            <button class="button m-1" on:click={() => setPeer($relay.peer)}>Set</button>
            <button class="button m-1" on:click={resetPeer}>Reset</button>
          </div>
  
          {#if $relay.status !== 'offline'}
            <div class="info">
              <div class="p-0">Relay server is {$relay.status} for {$relay.age}</div>
              <div class="num p-0">Delay: {$relay.delay} ms</div>
              <div class="num p-0">Pulse drift: {$relay.lag} ms</div>
              <div class="num p-0">Active wires: {$relay.activeWires} / {$relay.totalConnections}</div>
              <div class="p-0">Data storage is {$relay.store ? 'enabled' : 'disabled'}</div>
            </div>
          {/if}
        </div>
        <GunRelayList />
      </div>
    </UiLayer>
  </div>
  
  <style lang="postcss">
    .num {
      font-variant-numeric: tabular-nums;
    }
  
    .active {
      @apply text-lg bg-gray-900 font-bold;
    }
  </style>
