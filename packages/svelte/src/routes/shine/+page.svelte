<script lang="ts">
  import { onMount } from "svelte";
  import Gun from "gun/gun";
  import { optimism } from "viem/chains";
  import { wagmiConfig } from "$lib/wagmi.js";
  import { getAccount } from "@wagmi/core";
  import { gun } from "$lib/stores";
  import { get } from "svelte/store";
  import { ethers } from "ethers";
  import "gun-eth";

  let message = "";
  let nodeId = "";
  let savedMessage = "";
  let contentHash = "";
  let txHash = "";
  let isVerified = false;
  let isLoading = false;
  let error = "";
  let verificationResult: any = null;

  let gunInstance: any;

  let account = getAccount(wagmiConfig);

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
      // Genera un nodeId casuale se non è stato fornito
      const currentNodeId = nodeId || ethers.randomBytes(32).toString("hex");

      // Usa il plugin SHINE per salvare il messaggio
      const result = await new Promise((resolve, reject) => {
        gunInstance.shine("optimismSepolia", currentNodeId, { message }, ack => {
          if (ack.err) reject(new Error(ack.err));
          else resolve(ack);
        });
      });

      console.log("Risultato salvataggio:", result);
      txHash = result.message; // Assumiamo che il plugin restituisca l'hash della transazione
      savedMessage = message;
      nodeId = currentNodeId;
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
      // Usa il plugin SHINE per verificare il messaggio
      verificationResult = await new Promise((resolve, reject) => {
        gunInstance.shine("optimismSepolia", nodeId, null, function (ack) {
          if (ack.err) reject(new Error(ack.err));
          else resolve(ack);
        });
      });

      console.log("Risultato verifica:", verificationResult);
      isVerified = verificationResult.ok;

      // Recupera il messaggio da Gun
      savedMessage = await new Promise(resolve => {
        gunInstance.get(nodeId).once(data => resolve(data.message));
      });
    } catch (err) {
      console.error("Errore durante la verifica:", err);
      error = `Si è verificato un errore durante la verifica del messaggio: ${err.message}`;
      isVerified = false;
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="mb-4 text-2xl font-bold">Demo SHINE (Secure Hash Integrity Network Ethereum)</h1>

  <div class="mb-4">
    <input
      type="text"
      bind:value={message}
      placeholder="Inserisci un messaggio"
      class="mb-2 w-full rounded border p-2"
    />
    <input
      type="text"
      bind:value={nodeId}
      placeholder="Node ID (opzionale per il salvataggio, obbligatorio per la verifica)"
      class="w-full rounded border p-2"
    />
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
    <div class="mt-4">
      <h2 class="text-xl font-semibold">Messaggio Salvato:</h2>
      <p>{savedMessage}</p>
      <p class="text-sm text-gray-600">Node ID: {nodeId}</p>
      {#if txHash}
        <p class="text-sm text-gray-600">Transaction Hash: {txHash}</p>
      {/if}
    </div>
  {/if}

  {#if verificationResult}
    <div class="mt-4">
      <h2 class="text-xl font-semibold">Risultato Verifica:</h2>
      <p class={isVerified ? "text-green-500" : "text-red-500"}>
        {isVerified ? "Il messaggio è verificato e integro." : "Il messaggio non è verificato o è stato alterato."}
      </p>
      {#if verificationResult.updater}
        <p class="text-sm text-gray-600">Updater: {verificationResult.updater}</p>
      {/if}
      {#if verificationResult.timestamp}
        <p class="text-sm text-gray-600">
          Timestamp: {new Date(parseInt(verificationResult.timestamp) * 1000).toLocaleString()}
        </p>
      {/if}
    </div>
  {/if}
</div>
