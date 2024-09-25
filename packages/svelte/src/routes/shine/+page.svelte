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
  let savedMessage = "";
  let hash = "";
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
      // Genera l'hash del messaggio
      hash = ethers.keccak256(ethers.toUtf8Bytes(message));

      // Usa il plugin SHINE per salvare il messaggio
      await new Promise<void>((resolve, reject) => {
        gunInstance.shine("optimismSepolia", { message, hash }, ack => {
          if (ack.err) reject(new Error(ack.err));
          else {
            txHash = ack.message; // Assumiamo che il plugin restituisca l'hash della transazione
            resolve();
          }
        });
      });

      savedMessage = message;
      message = "";
    } catch (err) {
      console.error(err);
      error = "Si è verificato un errore durante il salvataggio del messaggio.";
    } finally {
      isLoading = false;
    }
  }

  async function verifyMessage() {
    if (!savedMessage) {
      error = "Nessun messaggio da verificare.";
      return;
    }

    isLoading = true;
    error = "";

    try {
      // Genera nuovamente l'hash del messaggio salvato
      const currentHash = ethers.keccak256(ethers.toUtf8Bytes(savedMessage));

      // Usa il plugin SHINE per verificare l'hash
      verificationResult = await new Promise((resolve, reject) => {
        gunInstance.shine("optimismSepolia", { hash: currentHash }, ack => {
          if (ack.err) reject(new Error(ack.err));
          else resolve(ack);
        });
      });

      isVerified = verificationResult.ok;
    } catch (err) {
      console.error(err);
      error = "Si è verificato un errore durante la verifica del messaggio.";
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="mb-4 text-2xl font-bold">Demo SHINE (Secure Hash Integrity Network Ethereum)</h1>

  <div class="mb-4">
    <input type="text" bind:value={message} placeholder="Inserisci un messaggio" class="w-full rounded border p-2" />
  </div>

  <button on:click={saveMessage} disabled={isLoading} class="mr-2 rounded bg-blue-500 p-2 text-white">
    {isLoading ? "Salvataggio in corso..." : "Salva Messaggio"}
  </button>

  <button on:click={verifyMessage} disabled={isLoading || !savedMessage} class="rounded bg-green-500 p-2 text-white">
    {isLoading ? "Verifica in corso..." : "Verifica Messaggio"}
  </button>

  {#if error}
    <p class="mt-2 text-red-500">{error}</p>
  {/if}

  {#if savedMessage}
    <div class="mt-4">
      <h2 class="text-xl font-semibold">Messaggio Salvato:</h2>
      <p>{savedMessage}</p>
      <p class="text-sm text-gray-600">Hash: {hash}</p>
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
      {#if verificationResult.storer}
        <p class="text-sm text-gray-600">Storer: {verificationResult.storer}</p>
      {/if}
      {#if verificationResult.nodeId}
        <p class="text-sm text-gray-600">Node ID: {verificationResult.nodeId}</p>
      {/if}
    </div>
  {/if}
</div>
