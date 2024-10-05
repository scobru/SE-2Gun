<script lang="ts">
  import { onMount } from "svelte";
  import Gun from "gun/gun";
  import { gun } from "$lib/stores";
  import { get } from "svelte/store";
  import "../../../../gun-eth/gun-eth";

  let message = "";
  let nodeId = "";
  let savedMessage = "";
  let txHash = "";
  let isLoading = false;
  let error = "";
  let verificationResult: any = null;

  let gunInstance: any;

  onMount(async () => {
    gunInstance = get(gun) === null ? Gun() : get(gun);
  });

  async function saveMessage() {
    if (!message) {
      error = "Per favore, inserisci un messaggio.";
      return;
    }

    isLoading = true;
    error = "";

    try {
      const data = { message };

      const result = await new Promise((resolve, reject) => {
        gunInstance.shine("optimismSepolia", null, data, function (ack) {
          if (ack && ack.err) reject(new Error(ack.err));
          else resolve(ack);
        });
      });

      console.log("Risultato salvataggio:", result);
      txHash = result.txHash;
      savedMessage = message;
      nodeId = result.nodeId;
      message = "";
    } catch (err) {
      console.error("Errore durante il salvataggio:", err);
      error = `Si è verificato un errore durante il salvataggio del messaggio: ${err.message}`;
    } finally {
      isLoading = false;
    }
  }

  async function verifyMessage() {
    if (!nodeId) {
      error = "Per favore, inserisci un Node ID da verificare.";
      return;
    }

    isLoading = true;
    error = "";

    try {
      const result = await new Promise((resolve, reject) => {
        gunInstance.shine("optimismSepolia", nodeId, null, function (ack) {
          if (ack && ack.err) reject(new Error(ack.err));
          else resolve(ack);
        });
      });

      console.log("Risultato verifica:", result);
      verificationResult = result;

      // Recupera il messaggio salvato
      gunInstance.get(nodeId).once(data => {
        if (data && data.message) {
          savedMessage = data.message;
        }
      });
    } catch (err) {
      console.error("Errore durante la verifica:", err);
      error = `Si è verificato un errore durante la verifica del messaggio: ${err.message}`;
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="mb-4 text-2xl font-bold">SHINE (Secure Hash Integrity Network Ethereum)</h1>

  <div class="mb-4">
    <input
      type="text"
      bind:value={message}
      placeholder="Inserisci un messaggio"
      class="mb-2 w-full rounded border p-2"
    />
    <input type="text" bind:value={nodeId} placeholder="Node ID (per la verifica)" class="w-full rounded border p-2" />
  </div>

  <button on:click={saveMessage} disabled={isLoading} class="mr-2 rounded bg-blue-500 p-2 text-white">
    {isLoading ? "Salvataggio in corso..." : "Salva Messaggio"}
  </button>

  <button on:click={verifyMessage} disabled={isLoading || !nodeId} class="rounded bg-green-500 p-2 text-white">
    {isLoading ? "Verifica in corso..." : "Verifica Messaggio"}
  </button>

  {#if error}
    <p class="mt-2 text-red-500">{error}</p>
  {/if}

  {#if savedMessage}
    <div class="card mt-4">
      <h2 class="text-xl font-semibold">Messaggio Salvato:</h2>
      <p>{savedMessage}</p>
      <p class="text-secondary text-sm">Node ID: {nodeId}</p>
      {#if txHash}
        <p class="text-secondary text-sm">Transaction Hash: {txHash}</p>
      {/if}
    </div>
  {/if}

  {#if verificationResult}
    <div class="mt-4">
      <h2 class="text-xl font-semibold">Risultato Verifica:</h2>
      <p class={verificationResult.ok ? "text-green-500" : "text-red-500"}>
        {verificationResult.message}
      </p>
      {#if verificationResult.updater}
        <p class="text-base-content text-sm">Updater: {verificationResult.updater}</p>
      {/if}
      {#if verificationResult.timestamp}
        <p class="text-base-content text-sm">
          Timestamp: {new Date(parseInt(verificationResult.timestamp) * 1000).toLocaleString()}
        </p>
      {/if}
    </div>
  {/if}
</div>
