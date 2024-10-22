<script lang="ts">
  import { onMount } from "svelte";
  import { createAccount } from "@byteatatime/wagmi-svelte";
  import { ethers } from "ethers";
  import { notification } from "$lib/utils/scaffold-eth/notification";
  import { browser } from "$app/environment";
  import { useGun } from "$lib/gun/gun";

  let message = $state("");
  let nodeId = $state("");
  let savedMessage = $state("");
  let txHash = $state("");
  let isLoading = $state(false);
  let error = $state("");
  let verificationResult = $state(null);
  let gunInstance = $state();
  let editMessage = $state("");
  let editNodeId = $state("");

  gunInstance = useGun();

  const { address, isConnected } = $derived.by(createAccount());

  async function saveMessage() {
    if (!message) {
      error = "Per favore, inserisci un messaggio.";
      return;
    }

    isLoading = true;
    error = "";

    try {
      const data = message;
      console.log("Tentativo di salvataggio del messaggio:", data);

      const result = await new Promise((resolve, reject) => {
        gunInstance?.shine("optimismSepolia", null, data, function (ack) {
          if (ack && ack.err) {
            console.error("Errore di GunDB:", ack.err);
            reject(new Error(ack.err));
          } else {
            console.log("Risultato di GunDB:", ack);
            resolve(ack);
          }
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
        gunInstance?.shine("optimismSepolia", nodeId, null, function (ack) {
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
      const existingData = await new Promise(resolve => {
        gunInstance?.get(editNodeId).once(data => resolve(data));
      });

      // Prepara i nuovi dati
      const newData = {
        message: editMessage,
        _contentHash: existingData._contentHash, // Manteniamo il contentHash precedente per il calcolo
      };

      // Calcola il nuovo contentHash
      const dataString = JSON.stringify(editMessage);
      const newContentHash = ethers.keccak256(ethers.toUtf8Bytes(dataString));

      // Aggiorna i dati con il nuovo contentHash
      newData._contentHash = newContentHash;

      // Modifica il messaggio e il _contentHash localmente su Gun
      gunInstance?.get(editNodeId).put(newData, ack => {
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

<div class="flex flex-grow flex-col font-sans">
  <article
    class="prose-p:text-lg prose-ul:text-lg prose-li:text-lg prose-li:list-disc prose-li:marker:text-ableton-blue p-10"
  >
    <h1 class="mb-8 text-4xl font-bold">SHINE</h1>
    <p class="mb-8 text-xl leading-relaxed">
      Secure Hash Integrity Network Ethereum: Un sistema per verificare l'integrità dei messaggi sulla blockchain.
    </p>
  </article>

  {#if address && isConnected}
    <div class="mb-8 grid grid-cols-1 gap-8 p-8 md:grid-cols-2">
      <div class="bg-ableton-orange rounded-none p-6 text-black">
        <h2 class="mb-4 text-2xl font-semibold">Save Message</h2>
        <input
          type="text"
          bind:value={message}
          placeholder="Inserisci un messaggio"
          class="mb-4 w-full border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
        />
        <!-- svelte-ignore event_directive_deprecated -->
        <button
          onclick={saveMessage}
          disabled={isLoading}
          class="hover:bg-ableton-beige w-full bg-transparent p-2 font-semibold capitalize text-white transition duration-300 ease-in-out hover:text-black"
        >
          {isLoading ? "Salvataggio in corso..." : "Salva Messaggio"}
        </button>
      </div>

      <div class="bg-ableton-green rounded-none p-6 text-black">
        <h2 class="mb-4 text-2xl font-semibold">Verify Message</h2>
        <input
          type="text"
          bind:value={nodeId}
          placeholder="Node ID"
          class="mb-4 w-full border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
        />
        <button
          onclick={verifyMessage}
          disabled={isLoading || !nodeId}
          class="w-full bg-transparent p-2 text-black transition duration-300 ease-in-out hover:bg-green-600"
        >
          {isLoading ? "Verifica in corso..." : "Verifica Messaggio"}
        </button>
      </div>

      <div class="bg-ableton-light-blue rounded-none p-6 text-black">
        <h2 class="mb-4 text-2xl font-semibold">Modify Off-Chain Message</h2>
        <input
          type="text"
          bind:value={editNodeId}
          placeholder="Node ID"
          class="mb-4 w-full border border-gray-300 p-2 text-black focus:border-blue-500 focus:outline-none"
        />
        <input
          type="text"
          bind:value={editMessage}
          placeholder="Nuovo messaggio"
          class="mb-4 w-full border border-gray-300 p-2 text-black focus:border-blue-500 focus:outline-none"
        />
        <button
          onclick={editLocalMessage}
          disabled={isLoading || !editNodeId || !editMessage}
          class="w-full bg-transparent p-2 text-black transition duration-300 ease-in-out hover:bg-purple-600"
        >
          {isLoading ? "Editing in progress..." : "Edit Off-Chain Message"}
        </button>
      </div>
    </div>

    {#if error}
      <p class="mb-4 text-red-500">{error}</p>
    {/if}

    <div class=" bg-ableton-light-blue w-full rounded-none text-black">
      {#if savedMessage}
        <div class=" rounded-none p-10">
          <h2 class="mb-4 text-3xl font-semibold">Saved Message</h2>
          <p class="mb-2">{savedMessage}</p>
          <p class="text-sm text-gray-600">Node ID: {nodeId}</p>
          {#if txHash}
            <p class="text-sm text-gray-600">Transaction Hash: {txHash}</p>
          {/if}
        </div>
      {/if}

      {#if verificationResult}
        <div class=" mb-8 rounded-none p-10">
          <h2 class="mb-4 text-3xl font-semibold">Verification Result</h2>
          <p class={verificationResult.ok ? "text-xl text-green-500" : "text-xl text-red-500"}>
            {verificationResult.ok ? "🎉" : "✖️"}
            {verificationResult.message}
          </p>
          {#if verificationResult.updater}
            <p class="text-sm">Updater: {verificationResult.updater}</p>
          {/if}
          {#if verificationResult.timestamp}
            <p class="text-sm">
              Timestamp: {new Date(parseInt(verificationResult.timestamp) * 1000).toLocaleString()}
            </p>
          {/if}
        </div>
      {/if}
    </div>
    <article
      class="prose-p:text-lg prose-ul:text-lg prose-li:text-lg prose-li:list-disc prose-li:marker:text-ableton-blue"
    >
      <div class="bg-ableton-yellow w-full rounded-none p-10 text-black">
        <h2 class="mb-10 text-5xl font-semibold">How to Use Verification</h2>
        <ol class="list-inside list-decimal space-y-2">
          <li>Save a message using the "Enter a message" field and the "Save Message" button.</li>
          <li>Copy the Node ID that appears after saving the message.</li>
          <li>Paste the Node ID into the "Node ID" field.</li>
          <li>Click the "Verify Message" button.</li>
          <li>
            The verification result will appear below, showing whether the message was successfully verified on the
            blockchain.
          </li>
        </ol>
        <p class="mt-4 text-sm text-gray-600">
          Note: The verification compares the hash of the locally saved message with the one recorded on the blockchain,
          confirming the integrity and authenticity of the data.
        </p>
      </div>
    </article>
  {:else}
    <p class="rounded-none bg-yellow-100 p-4 text-xl font-semibold">
      Per favore, connetti il tuo wallet per utilizzare questa funzionalità.
    </p>
  {/if}
</div>
