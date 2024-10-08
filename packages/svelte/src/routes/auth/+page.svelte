<script lang="ts">
  import Gun from 'gun'
  import "gun/sea"
  import "gun-eth";
  import { onMount } from "svelte";
  import { wagmiConfig } from "$lib/wagmi";
  import { getAccount } from "@wagmi/core";
  import { currentUser, gun } from "$lib/stores";
  import { get } from "svelte/store";
  import { notification } from "$lib/utils/scaffold-eth/notification";
  const { address, chainId, status, isConnected } = $derived.by(createAccount()); // createAccount is the Svelte version of useAccount



  import type { IGunInstance } from "gun/types";
  import type { IGunUserInstance } from "gun/types";
  import { createAccount } from "@byteatatime/wagmi-svelte";

  let SEA = Gun.SEA


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
    const gunInstance = get(gun)
    if (gunInstance) {
      user = gunInstance?.user();
    } else {
      console.error("Istanza di Gun non inizializzata correttamente");
    }
    account = getAccount(wagmiConfig);

    user.recall({ sessionStorage: true }, async ack => {
      if ("err" in ack) {
        console.error("Errore nel recupero della sessione:", ack.err);
      } else if (user.is && user.is.alias) {
        currentUser.set(user.is.alias as string);
        await loadUserData();
      }
    });

    user.on("auth", async () => {
      console.log("Utente autenticato:", user.is.alias as string);
      currentUser.set(user.is.alias as string);
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
        errorMessage = "Please connect your Ethereum wallet";
        return;
      }

      signature = await (gunInstance as any).createSignature(MESSAGE_TO_SIGN);

      if (!signature) {
        errorMessage = "Errore durante la firma del messaggio";
        return;
      }

      await (gunInstance as any).createAndStoreEncryptedPair(account.address, signature);

      user.create(account.address, signature, async (ack: { ok: 0; pub: string } | { err: string }) => {
        if ("err" in ack) {
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
    const gunInstance = get(gun); // Aggiunta di un fallback per evitare null
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
  {#if errorMessage}
    <div class="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
      <span class="block sm:inline">{errorMessage}</span>
    </div>
  {/if}

  {#if $currentUser === null}
    <div class="flex justify-center space-x-4">
      <button class="btn btn-primary" on:click={registra}><i class="fas fa-user-plus"></i> Sign In</button>
      <button class="btn btn-secondary" on:click={accedi}><i class="fas fa-sign-in-alt"></i> Login</button>
    </div>
  {:else}
    <div class="bg-base-100 mb-4 break-all break-all rounded px-8 pb-8 pt-6 text-center shadow-md">
      <h2 class="mb-4 text-2xl font-semibold">Welcome, {$currentUser}!</h2>

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

  <div class="bg-base-200 mt-12 rounded-lg p-6 shadow-lg">
    <h2 class="mb-4 text-3xl font-bold">How Authentication Works in SE-2Gun</h2>
    <ol class="list-inside list-decimal space-y-4">
      <li>
        <strong>Connect Wallet:</strong> Start by connecting your Ethereum wallet (e.g., MetaMask) to the application.
      </li>
      <li>
        <strong>Registration:</strong>
        <ul class="ml-6 mt-2 list-inside list-disc">
          <li>Click the "Sign In" button to start registration.</li>
          <li>You'll be asked to sign a message using your Ethereum wallet.</li>
          <li>A unique cryptographic pair is generated based on your Ethereum address and signature.</li>
          <li>This pair is encrypted and securely stored in GunDB.</li>
        </ul>
      </li>
      <li>
        <strong>Login:</strong>
        <ul class="ml-6 mt-2 list-inside list-disc">
          <li>Click the "Login" button to start the login process.</li>
          <li>You'll be asked to sign a message again using your Ethereum wallet.</li>
          <li>The signature is used to retrieve and decrypt your cryptographic pair from GunDB.</li>
          <li>If successful, you're authenticated and granted access to the application.</li>
        </ul>
      </li>
      <li>
        <strong>Data Encryption:</strong> Once authenticated, your data is encrypted using your cryptographic pair before
        being stored in GunDB, ensuring only you can access it.
      </li>
      <li>
        <strong>Logout:</strong> Click the "Esci" (Logout) button to clear your local session. Your encrypted data remains
        secure in GunDB, accessible only upon your next successful authentication.
      </li>
    </ol>
    <p class="mt-4 text-sm italic">
      This authentication flow combines Ethereum's cryptographic capabilities with GunDB's decentralized nature,
      providing a secure and user-controlled system.
    </p>
  </div>
</main>

<style>
</style>
