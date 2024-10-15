<script lang="ts">
  import Gun from "gun/gun";
  import "gun/sea";
  import { onMount } from "svelte";
  import { get, writable } from "svelte/store";
  import { currentUser, gun } from "$lib/stores";
  import { Network } from "vis-network/standalone";
  import type { IGunInstance } from "gun";

  let gunInstance: IGunInstance<any> | null = null;
  let nodeData = writable({});
  let nodePath = writable("");
  let errorMessage = "";
  let network: Network;
  let container: HTMLElement;
  let customRelay = writable("https://gun-relay.scobrudot.dev/");

  onMount(() => {
    initGun();
  });

  function initGun() {
    if (get(gun) === null) {
      gunInstance = gun.set(Gun(get(customRelay)));
    } else {
      gunInstance = get(gun);
    }
    gunInstance.on("hi", peer => {
      console.log("Connected to peer:", peer);
    });
    initNetwork();
  }

  function initNetwork() {
    const data = {
      nodes: [],
      edges: [],
    };
    const options = {
      nodes: {
        shape: "dot",
        size: 16,
      },
      physics: {
        forceAtlas2Based: {
          gravitationalConstant: -26,
          centralGravity: 0.005,
          springLength: 230,
          springConstant: 0.18,
        },
        maxVelocity: 146,
        solver: "forceAtlas2Based",
        timestep: 0.35,
        stabilization: { iterations: 150 },
      },
    };
    network = new Network(container, data, options);
    network.on("click", function (params) {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        nodePath.set(nodeId); // Aggiorna l'input box
        loadNodeData(nodeId); // Carica i dati del nodo
      }
    });
  }

  async function loadNodeData(path = $nodePath) {
    errorMessage = "";
    try {
      const trimmedPath = path.trim();
      if (!trimmedPath) {
        errorMessage = "Il percorso del nodo non può essere vuoto";
        return;
      }

      // Usa sempre gun.get() direttamente, sia per percorsi con '~' che senza
      gunInstance.get(trimmedPath).once((data, key) => {
        if (data) {
          nodeData.set(data);
          updateGraph(data, trimmedPath);
        } else {
          errorMessage = "Nessun dato trovato per il percorso specificato";
        }
      });
    } catch (error: unknown) {
      errorMessage =
        "Errore durante il caricamento dei dati del nodo: " + (error instanceof Error ? error.message : String(error));
    }
  }

  function updateGraph(data: any, rootPath: string) {
    const nodes: { id: any; label: any }[] = [];
    const edges: { from: any; to: any }[] = [];

    function addNode(id: string, label: string) {
      if (!nodes.some(node => node.id === id) && id !== "#" && id !== "_") {
        nodes.push({ id, label });
      }
    }

    function addEdge(from: any, to: string) {
      if (!edges.some(edge => edge.from === from && edge.to === to)) {
        edges.push({ from, to });
      }
    }

    function traverseObject(obj: { [x: string]: any }, parentId: string, depth = 0) {
      if (depth > 5) return; // Evita loop infiniti
      Object.keys(obj).forEach(key => {
        if (key !== "_" && key !== "#") {
          if (key === ">" && typeof obj[key] === "object") {
            Object.keys(obj[key]).forEach(refKey => {
              const cleanRefKey = refKey.startsWith("~") ? refKey.slice(1) : refKey;
              addNode(cleanRefKey, truncateString(cleanRefKey, 20));
              addEdge(parentId, cleanRefKey);
            });
          } else {
            const childId = parentId ? `${parentId}/${key}` : key;
            addNode(childId, key);
            if (parentId) {
              addEdge(parentId, childId);
            }
            if (typeof obj[key] === "object" && obj[key] !== null) {
              traverseObject(obj[key], childId, depth + 1);
            }
          }
        }
      });
    }

    addNode(rootPath, rootPath);
    traverseObject(data, rootPath);

    network.setData({ nodes, edges });
  }

  function isNodeReference(value: unknown) {
    return typeof value === "string" && value.startsWith("~");
  }

  function handleNodeClick(path: unknown) {
    nodePath.set(path);
    loadNodeData(path);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // Opzionale: mostra un feedback all'utente
      alert("Copiato negli appunti!");
    });
  }

  function truncateString(str: unknown, num: number) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }

  function setCustomRelay() {
    initGun();
    loadNodeData();
  }
</script>

<main class="container mx-auto w-full p-4">
  <h1 class="text-base-content mb-8 text-center text-4xl font-bold">GunDB Node Inspector</h1>

  {#if errorMessage}
    <div class="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
      <span class="block sm:inline">{errorMessage}</span>
    </div>
  {/if}

  <div class="bg-ableton-light-blue mb-4 flex w-full flex-col justify-center">
    <input
      type="text"
      class="input input-bordered w-full"
      placeholder="Enter custom relay URL"
      bind:value={$customRelay}
    />
    <button class=" btn bg-ableton-beige" on:click={setCustomRelay}>Set Relay</button>
    <span class="block p-2 font-mono text-sm text-black">Current Relay: {$customRelay}</span>
    <input
      type="text"
      class="input input-bordered w-full"
      placeholder="Enter node path example: users"
      bind:value={$nodePath}
    />
    <button class="btn btn-primary" on:click={() => loadNodeData()}>Load Node Data</button>
  </div>

  <div class="flex flex-col md:flex-row">
    <div class="mb-4 w-full pr-2 md:mb-0 md:w-1/2">
      <div bind:this={container} class=" bg-ableton-yellow" style="height: 400px;"></div>
    </div>
    <div class="w-full pl-2 md:w-1/2">
      {#if $nodeData}
        <div class="bg-ableton-light-blue overflow-auto p-4 shadow-md" style="max-height: 400px;">
          <h2 class="mb-4 text-xl font-semibold">Node Data:</h2>
          <div class="node-data-content">
            {#each Object.entries($nodeData) as [key, value]}
              <div class="mb-2">
                <strong class="text-blue-600">{key}:</strong>
                {#if isNodeReference(value)}
                  <span
                    class="cursor-pointer text-green-500 hover:underline"
                    on:click={() => handleNodeClick(value)}
                    on:keydown={e => e.key === "Enter" && handleNodeClick(value)}
                    role="button"
                    tabindex="0"
                  >
                    {truncateString(value, 30)}
                  </span>
                {:else if typeof value === "object"}
                  <details>
                    <summary class="cursor-pointer text-gray-700 hover:text-gray-900">Object</summary>
                    <pre class="mt-2 text-sm">{JSON.stringify(value, null, 2)}</pre>
                  </details>
                {:else}
                  <span class="text-gray-700">{truncateString(value.toString(), 50)}</span>
                {/if}
                <button
                  class="ml-2 rounded bg-gray-200 px-2 py-1 text-xs hover:bg-gray-300"
                  on:click={() => copyToClipboard(value.toString())}
                >
                  Copy
                </button>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</main>

<style>
  :global(body) {
    @apply bg-gray-100;
  }

  .node-data-content {
    font-family: monospace;
  }
</style>
