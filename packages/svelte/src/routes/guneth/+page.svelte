<script lang="ts">
  import Gun from "gun";
  import "gun/sea";
  import { onMount } from "svelte";
  import { wagmiConfig } from "$lib/wagmi";
  import { getAccount } from "@wagmi/core";
  import "$lib/guneth"; // Assicurati che il percorso sia corretto

  let gun;
  let user;
  let currentUser = null;
  let errorMessage = "";
  let account = null;
  let userPair = null;
  let userPublicData = null;

  const MESSAGE_TO_SIGN = "Accesso a GunDB con Ethereum";

  onMount(() => {
    gun = Gun();
    user = gun.user();

    user.recall({ sessionStorage: true }, ack => {
      if (ack.err) {
        console.error("Errore nel recupero della sessione:", ack.err);
      } else if (user.is) {
        currentUser = user.is.alias;
        loadUserData();
      }
    });

    user.on("auth", () => {
      console.log("Utente autenticato:", user.is.alias);
      currentUser = user.is.alias;
      loadUserData();
    });
  });

  async function loadUserData() {
    if (currentUser) {
      const signature = await gun.createSignature(MESSAGE_TO_SIGN);
      userPair = await gun.getAndDecryptPair(currentUser, signature);
      userPublicData = await gun.get(`~@${currentUser}`).then();
      console.log("User Pair:", userPair);
      console.log("User Public Data:", userPublicData);
    }
  }

  async function registra() {
    console.log("Registrazione in corso...");
    errorMessage = "";

    try {
      account = getAccount(wagmiConfig);
      if (!account.address) {
        errorMessage = "Nessun account Ethereum connesso";
        return;
      }

      const signature = await gun.createSignature(MESSAGE_TO_SIGN);
      if (!signature) {
        errorMessage = "Errore durante la firma del messaggio";
        return;
      }

      await gun.createAndStoreEncryptedPair(account.address, signature);

      user.create(account.address, signature, ack => {
        if (ack.err) {
          errorMessage = "Errore durante la registrazione: " + ack.err;
        } else {
          alert("Registrazione completata! Ora puoi accedere.");
        }
      });
    } catch (error) {
      errorMessage = "Errore durante la registrazione: " + error.message;
    }
  }

  async function accedi() {
    console.log("Accesso in corso...");
    errorMessage = "";

    try {
      account = getAccount(wagmiConfig);
      if (!account.address) {
        errorMessage = "Nessun account Ethereum connesso";
        return;
      }

      const signature = await gun.createSignature(MESSAGE_TO_SIGN);
      if (!signature) {
        errorMessage = "Errore durante la firma del messaggio";
        return;
      }

      const pair = await gun.getAndDecryptPair(account.address, signature);
      console.log("Pair:", pair);
      if (!pair) {
        errorMessage = "Errore nel recupero del pair dell'utente";
        return;
      }

      user.auth(pair, ack => {
        console.log("Risposta di autenticazione:", ack);
        if (ack.err) {
          errorMessage = "Errore di accesso: " + ack.err;
        } else {
          console.log("Accesso riuscito");
          currentUser = user.is.alias;
        }
      });
    } catch (error) {
      errorMessage = "Errore durante l'accesso: " + error.message;
    }
  }

  function esci() {
    user.leave();
    currentUser = null;
    userPair = null;
    errorMessage = "";
  }
</script>

<main class="container mx-auto p-4">
  <h1 class="text-primary mb-8 text-center text-4xl font-bold">Autenticazione con GunDB e Ethereum</h1>

  {#if errorMessage}
    <div class="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
      <span class="block sm:inline">{errorMessage}</span>
    </div>
  {/if}

  {#if !currentUser}
    <div class="flex justify-center space-x-4">
      <button class="btn btn-primary" on:click={registra}>Registra con Ethereum</button>
      <button class="btn btn-secondary" on:click={accedi}>Accedi con Ethereum</button>
    </div>
  {:else}
    <div class="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md">
      <h2 class="mb-4 text-2xl font-semibold">Benvenuto, {currentUser}!</h2>

      {#if userPublicData}
        <div class="mb-4">
          <h3 class="mb-2 text-xl font-semibold">Dati pubblici dell'utente:</h3>
          <pre class="overflow-x-auto rounded bg-gray-100 p-4">
            {JSON.stringify(
              {
                alias: userPublicData.alias,
                pub: userPublicData.pub,
                epub: userPublicData.epub,
              },
              null,
              2,
            )}
          </pre>
        </div>
      {/if}

      {#if userPair}
        <div class="mb-4">
          <h3 class="mb-2 text-xl font-semibold">Pair dell'utente (privato):</h3>
          <pre class="overflow-x-auto rounded bg-gray-100 p-4">
            {JSON.stringify(userPair, null, 2)}
          </pre>
        </div>
      {/if}

      <button class="btn btn-warning" on:click={esci}>Esci</button>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    @apply bg-gray-100;
  }
</style>
