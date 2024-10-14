<script lang="ts">
  import { onMount } from "svelte";
  import Gun from "gun";
  import { gun } from "$lib/stores";
  import { get } from "svelte/store";
  import "gun-eth";
  import { createAccount } from "@byteatatime/wagmi-svelte";
  import { tick } from "svelte";

  let message = $state("");
  let nodeId = $state("");
  let savedMessage = $state("");
  let txHash = $state("");
  let isLoading = $state(false);
  let error = $state("");
  let verificationResult = $state(null);
  let gunInstance = $state(null);

  onMount(async () => {
    gunInstance = get(gun) === null ? new Gun() : get(gun);
  });

  const { address, chainId, status, isConnected } = $derived.by(createAccount());

  async function saveMessage() {
    // ... (il resto del codice rimane invariato)
  }

  async function verifyMessage() {
    // ... (il resto del codice rimane invariato)
  }
</script>

<main class="container font-sans">
  <article class="p-10 prose-p:text-lg prose-ul:text-lg prose-li:text-lg prose-li:list-disc prose-li:marker:text-ableton-blue">
  <h1 class="text-4xl font-bold mb-8">SHINE</h1>
  <p class="text-xl mb-8 leading-relaxed">
    Secure Hash Integrity Network Ethereum: Un sistema per verificare l'integrità dei messaggi sulla blockchain.
  </p>
  </article>

  {#if isConnected}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 p-8">
      <div class="bg-ableton-orange p-6 rounded-none text-black ">
        <h2 class="text-2xl font-semibold mb-4">Save Message</h2>
        <input
          type="text"
          bind:value={message}
          placeholder="Inserisci un messaggio"
          class="w-full p-2 mb-4 border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button 
          on:click={saveMessage} 
          disabled={isLoading} 
          class="w-full bg-transparent capitalize font-semibold text-white p-2 hover:bg-ableton-beige hover:text-black transition duration-300 ease-in-out"
        >
          {isLoading ? "Salvataggio in corso..." : "Salva Messaggio"}
        </button>
      </div>

      <div class="bg-ableton-green   p-6 rounded-none text-black">
        <h2 class="text-2xl font-semibold mb-4">Verify Message</h2>
        <input
          type="text"
          bind:value={nodeId}
          placeholder="Node ID"
          class="w-full p-2 mb-4 border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button 
          on:click={verifyMessage} 
          disabled={isLoading || !nodeId} 
          class="w-full bg-transparent text-black p-2 hover:bg-green-600 transition duration-300 ease-in-out"
        >
          {isLoading ? "Verifica in corso..." : "Verifica Messaggio"}
        </button>
      </div>
    </div>

    {#if error}
      <p class="text-red-500 mb-4">{error}</p>
    {/if}

    {#if savedMessage}
      <div class="bg-white p-6 rounded-none shadow-md mb-8">
        <h2 class="text-2xl font-semibold mb-4">Messaggio Salvato</h2>
        <p class="mb-2">{savedMessage}</p>
        <p class="text-sm text-gray-600">Node ID: {nodeId}</p>
        {#if txHash}
          <p class="text-sm text-gray-600">Transaction Hash: {txHash}</p>
        {/if}
      </div>
    {/if}

    {#if verificationResult}
      <div class="bg-white p-6 rounded-none shadow-md mb-8">
        <h2 class="text-2xl font-semibold mb-4">Risultato Verifica</h2>
        <p class={verificationResult.ok ? "text-green-500" : "text-red-500"}>
          {verificationResult.message}
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
      <article class="prose-p:text-lg prose-ul:text-lg prose-li:text-lg prose-li:list-disc prose-li:marker:text-ableton-blue">
    <div class="bg-ableton-yellow w-screen p-10 rounded-none text-black">
      <h2 class="text-5xl font-semibold mb-10">How to Use Verification</h2>
      <ol class="list-decimal list-inside space-y-2">
        <li>Save a message using the "Enter a message" field and the "Save Message" button.</li>
        <li>Copy the Node ID that appears after saving the message.</li>
        <li>Paste the Node ID into the "Node ID" field.</li>
        <li>Click the "Verify Message" button.</li>
        <li>The verification result will appear below, showing whether the message was successfully verified on the blockchain.</li>
      </ol>
      <p class="mt-4 text-sm text-gray-600">
        Note: The verification compares the hash of the locally saved message with the one recorded on the blockchain, confirming the integrity and authenticity of the data.
      </p>
    </div>
  </article>
  {:else}
    <p class="text-xl font-semibold bg-yellow-100 p-4 rounded-none">Per favore, connetti il tuo wallet per utilizzare questa funzionalità.</p>
  {/if}
</main>