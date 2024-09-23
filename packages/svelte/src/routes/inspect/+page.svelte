<script lang="ts">
  import Gun from "gun";
  import "gun/sea";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  let gun;
  let nodeData = writable({});
  let nodePath = writable("");
  let errorMessage = "";

  onMount(() => {
    gun = Gun();
  });

  async function loadNodeData() {
    errorMessage = "";
    try {
      const path = $nodePath.trim();
      if (!path) {
        errorMessage = "Il percorso del nodo non può essere vuoto";
        return;
      }

      gun.get(path).once(data => {
        if (data) {
          nodeData.set(data);
        } else {
          errorMessage = "Nessun dato trovato per il percorso specificato";
        }
      });
    } catch (error) {
      errorMessage = "Errore durante il caricamento dei dati del nodo: " + error.message;
    }
  }
</script>

<main class="container mx-auto w-full p-4">
  <h1 class="text-base-content mb-8 text-center text-6xl font-bold">GunDB Node Inspector</h1>
  <h1 class="text-base-content mb-8 text-center text-6xl font-bold">🔍</h1>

  {#if errorMessage}
    <div class="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
      <span class="block sm:inline">{errorMessage}</span>
    </div>
  {/if}

  <div class="mb-4 flex justify-center">
    <input
      type="text"
      class="input input-bordered w-full max-w-xs"
      placeholder="Enter node path example: users"
      bind:value={$nodePath}
    />
    <button class="btn btn-primary ml-2" on:click={loadNodeData}>Load Node Data</button>
  </div>

  {#if $nodeData}
    <div class="bg-base-100 mb-4 break-all rounded px-8 pb-8 pt-6 text-center shadow-md">
      <h2 class="mb-4 text-2xl font-semibold">Node Data:</h2>
      <div class="node-data-content">
        <code>{JSON.stringify($nodeData, null, 2)}</code>
      </div>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    @apply bg-gray-100;
  }

  .node-data-content {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    border-radius: 0.5rem; /* Angoli arrotondati */
    overflow-x: auto; /* Permette lo scorrimento orizzontale se necessario */
    white-space: pre-wrap; /* Permette il wrapping del testo */
    word-wrap: break-word; /* Permette il wrapping delle parole */
    font-family: monospace; /* Font tipico per il codice */
  }

  .node-data-content code {
    white-space: pre-wrap; /* Mantiene il formato del JSON */
  }
</style>
