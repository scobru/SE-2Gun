<script lang="ts">
  import { onMount } from "svelte";
  import Gun from "gun";
  import { gun } from "$lib/stores";
  import { get } from "svelte/store";
  import "gun-eth";
  import { createAccount } from "@byteatatime/wagmi-svelte";
  import { tick } from "svelte";
  import { useGun } from "$lib/gun/gun";
import { ethers } from "ethers";
  import { notification } from "$lib/utils/scaffold-eth/notification";

  let message = $state("");
  let nodeId = $state("");
  let savedMessage = $state("");
  let txHash = $state("");
  let isLoading = $state(false);
  let error = $state("");
  let verificationResult = $state(null);
  let gunInstance = $state(null);
  let editMessage = $state("");
  let editNodeId = $state("");

  onMount(async () => {
    gunInstance = useGun() === null ? new Gun() : useGun();
  });

  const { address, chainId, status, isConnected } = $derived.by(createAccount());

  async function saveMessage() {
    if (!message) {
      error = "Per favore, inserisci un messaggio.";
      return;
    }

    isLoading = true;
    error = "";

    try {
      const data =  message ;

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

  async function editLocalMessage() {
    if (!editNodeId || !editMessage) {
      error = "Per favore, inserisci sia il Node ID che il nuovo messaggio.";
      return;
    }

    isLoading = true;
    error = "";

    try {
      // Recupera il dato esistente
      const existingData = await new Promise((resolve) => {
        gunInstance.get(editNodeId).once((data) => resolve(data));
      });

      // Prepara i nuovi dati
      const newData = {
        message: editMessage,
        _contentHash: existingData._contentHash // Manteniamo il contentHash precedente per il calcolo
      };

      // Calcola il nuovo contentHash
      const dataString = JSON.stringify(editMessage);
      const newContentHash = ethers.keccak256(ethers.toUtf8Bytes(dataString));

      // Aggiorna i dati con il nuovo contentHash
      newData._contentHash = newContentHash;

      // Modifica il messaggio e il _contentHash localmente su Gun
      gunInstance.get(editNodeId).put(newData, (ack) => {
        if (ack.err) {
          throw new Error(ack.err);
        }
        notification.success("Messaggio e hash modificati localmente con successo!");
        savedMessage = editMessage;
      });
    } catch (err) {
      console.error("Errore durante la modifica locale:", err);
      error = `Si è verificato un errore durante la modifica locale del messaggio: ${err.message}`;
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="flex flex-grow flex-col  font-sans">
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
        <!-- svelte-ignore event_directive_deprecated -->
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

      <div class="bg-ableton-purple p-6 rounded-none text-white">
        <h2 class="text-2xl font-semibold mb-4">Modifica Messaggio Locale</h2>
        <input
          type="text"
          bind:value={editNodeId}
          placeholder="Node ID"
          class="w-full p-2 mb-4 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
        />
        <input
          type="text"
          bind:value={editMessage}
          placeholder="Nuovo messaggio"
          class="w-full p-2 mb-4 border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
        />
        <button 
          on:click={editLocalMessage} 
          disabled={isLoading || !editNodeId || !editMessage} 
          class="w-full bg-transparent text-white p-2 hover:bg-purple-600 transition duration-300 ease-in-out"
        >
          {isLoading ? "Modifica in corso..." : "Modifica Messaggio Locale"}
        </button>
      </div>
    </div>

    {#if error}
      <p class="text-red-500 mb-4">{error}</p>
    {/if}

    {#if savedMessage}
      <div class=" p-6 rounded-none bg-ableton-light-blue text-black ">
        <h2 class="text-2xl font-semibold mb-4">Saved Message</h2>
        <p class="mb-2">{savedMessage}</p>
        <p class="text-sm text-gray-600">Node ID: {nodeId}</p>
        {#if txHash}
          <p class="text-sm text-gray-600">Transaction Hash: {txHash}</p>
        {/if}
      </div>
    {/if}

    {#if verificationResult}
      <div class=" p-6 rounded-none bg-ableton-blue text-white   mb-8">
        <h2 class="text-2xl font-semibold mb-4">Verification Result</h2>
        <p class={verificationResult.ok ? "text-green-500" : "text-red-500"}>
          {verificationResult.message}
        </p>
        {#if verificationResult.updater}
          <p class="text-sm ">Updater: {verificationResult.updater}</p>
        {/if}
        {#if verificationResult.timestamp}
          <p class="text-sm ">
            Timestamp: {new Date(parseInt(verificationResult.timestamp) * 1000).toLocaleString()}
          </p>
        {/if}
      </div>
    {/if}
      <article class="prose-p:text-lg prose-ul:text-lg prose-li:text-lg prose-li:list-disc prose-li:marker:text-ableton-blue">
    <div class="bg-ableton-yellow w-full p-10 rounded-none text-black">
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
</div>
