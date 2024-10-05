<script lang="ts">
  import Gun from "gun";
  import "gun/sea";
  import { onMount } from "svelte";
  import { wagmiConfig } from "$lib/wagmi";
  import { getAccount } from "@wagmi/core";
  import "gun-eth";
  import { currentUser, gun } from "$lib/stores";
  import { get } from "svelte/store";
  import { notification } from "$lib/utils/scaffold-eth/notification";
  import type { IGunInstance } from "gun/types";
  import type { IGunUserInstance } from "gun/types";

  let user: IGunUserInstance = {
    recall: (options: { sessionStorage: boolean }, callback: (ack: any) => Promise<void>) => {},
    is: { alias: null },
    on: (event: string, callback: () => Promise<void>) => {},
    create: (alias: any, pass: any, callback: (ack: any) => Promise<void>) => {},
    auth: (alias: any, pass: any, callback: (ack: any) => Promise<void>) => {},
    leave: () => {},
  };

  let errorMessage = "";
  let account: any = null;
  let userPair: ArrayLike<unknown> | { [s: string]: unknown } | null = null;
  let signature: null = null;

  const MESSAGE_TO_SIGN = "Accesso a GunDB con Ethereum";

  onMount(() => {
    let tempGun = new Gun();
    gun.set(tempGun);
    const gunInstance = get(gun) as unknown as IGunInstance<any>;
    if (gunInstance) {
      user = gunInstance?.user();
    } else {
      console.error("Istanza di Gun non inizializzata correttamente");
    }
    account = getAccount(wagmiConfig);

    user.recall({ sessionStorage: true }, async (ack: { err: any }) => {
      if (ack.err) {
        console.error("Errore nel recupero della sessione:", ack.err);
      } else if (user.is) {
        currentUser.set(user.is.alias);
        await loadUserData();
      }
    });

    user.on("auth", async () => {
      console.log("Utente autenticato:", user.is.alias);
      currentUser.set(user.is.alias);
      await loadUserData();
    });
  });

  async function loadUserData() {
    console.log("Loading user data...");
    currentUser.subscribe(value => currentUser.set(value));
    const gunInstance = get(gun) || {}; // Aggiunta di un fallback per evitare null

    if (currentUser) {
      userPair = await gunInstance?.getAndDecryptPair(account.address, signature);
      console.log("User Pair:", userPair);
    }
  }

  async function registra() {
    console.log("Registrazione in corso...");
    errorMessage = "";
    const gunInstance = get(gun) || {}; // Aggiunta di un fallback per evitare null
    account = getAccount(wagmiConfig);
    user = gunInstance.user();

    try {
      if (!account.address) {
        errorMessage = "Nessun account Ethereum connesso";
        return;
      }

      signature = await gunInstance.createSignature(MESSAGE_TO_SIGN);
      if (!signature) {
        errorMessage = "Errore durante la firma del messaggio";
        return;
      }

      await gunInstance.createAndStoreEncryptedPair(account.address, signature);

      user.create(account.address, signature, async (ack: { err: string }) => {
        if (ack.err) {
          errorMessage = "Errore durante la registrazione: " + ack.err;
        } else {
          alert("Registrazione completata! Ora puoi accedere.");
          await loadUserData();
          currentUser.set(user.is.alias);
        }
      });
    } catch (error) {
      errorMessage = "Errore durante la registrazione: " + error.message;
    }
  }

  async function accedi() {
    account = getAccount(wagmiConfig);

    if (!account.address) {
      notification.error("Nessun account Ethereum connesso");
      return;
    }
    console.log("Accesso in corso...");
    errorMessage = "";
    const gunInstance = get(gun) || {}; // Aggiunta di un fallback per evitare null
    user = gunInstance.user();

    try {
      account = getAccount(wagmiConfig);
      if (!account.address) {
        errorMessage = "Nessun account Ethereum connesso";
        return;
      }

      signature = await gunInstance.createSignature(MESSAGE_TO_SIGN);
      if (!signature) {
        errorMessage = "Errore durante la firma del messaggio";
        return;
      }

      const pair = await gunInstance.getAndDecryptPair(account.address, signature);
      console.log("Pair:", pair);
      if (!pair) {
        errorMessage = "Errore nel recupero del pair dell'utente";
        return;
      }

      user.auth(pair, async (ack: { err: string }) => {
        console.log("Risposta di autenticazione:", ack);
        if (ack.err) {
          errorMessage = "Errore di accesso: " + ack.err;
        } else {
          console.log("Accesso riuscito");
          currentUser.set(user.is.alias);
          await loadUserData();
        }
      });
    } catch (error) {
      errorMessage = "Errore durante l'accesso: " + error.message;
    }
  }

  function esci() {
    user.leave();
    currentUser.set(null);
    userPair = null;
    errorMessage = "";
  }
</script>

<main class="container mx-auto w-full p-4">
  <h1 class="text-base-content mb-8 text-center text-6xl font-bold">Auth</h1>
  <h1 class="text-base-content mb-8 text-center text-6xl font-bold">🔐</h1>

  {#if errorMessage}
    <div class="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
      <span class="block sm:inline">{errorMessage}</span>
    </div>
  {/if}

  {#if $currentUser === null}
    <div class="flex justify-center space-x-4">
      <button class="btn btn-primary" on:click={registra}><i class="fas fa-user-plus"></i> Registra con Ethereum</button
      >
      <button class="btn btn-secondary" on:click={accedi}><i class="fas fa-sign-in-alt"></i> Accedi con Ethereum</button
      >
    </div>
  {:else}
    <div class="bg-base-100 mb-4 break-all rounded px-8 pb-8 pt-6 text-center shadow-md">
      <h2 class="mb-4 text-2xl font-semibold">Benvenuto, {$currentUser}!</h2>

      {#if userPair && Object.keys(userPair).length > 0}
        <div class="my-5 items-center">
          <ul class="mx-auto w-2/4 text-left">
            {#each Object.entries(userPair) as [key, value]}
              <li class="mb-2">
                <strong>{key}:</strong> <span class="text-base-content">{JSON.stringify(value, null, 2)}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}

      <button class="btn btn-warning" on:click={esci}><i class="fas fa-sign-out-alt"></i> Esci</button>
      <button class="btn btn-warning" on:click={accedi}><i class="fas fa-eye"></i> View Pair</button>
    </div>
  {/if}
</main>

<style>
</style>
