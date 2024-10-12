<script lang="ts">
  import { onMount } from "svelte";
  import { wagmiConfig } from "$lib/wagmi";
  import { getAccount } from "@wagmi/core";
  import { currentUser, gun } from "$lib/stores";
  import { get } from "svelte/store";
  import { notification } from "$lib/utils/scaffold-eth/notification";
  import { initializeAuth, signIn, login, logout } from "$lib/gun/auth";
  import { useUser } from "$lib/gun/user";

  let errorMessage: string | null = null;
  let userPair: Record<string, any> | null = null;
  
  let { user } = useUser()

  onMount(() => {
    initializeAuth();
  });

  function setErrorMessage(message: string | null) {
    errorMessage = message;
    if (message) {
      setTimeout(() => {
        errorMessage = null;
      }, 5000); // Il messaggio di errore scomparirà dopo 5 secondi
    }
  }

  async function handlesignIn() {
    const result = await signIn();
    if (result) {
      setErrorMessage(result);
    } else {
      notification.success("signInzione completata con successo!");
    }
  }

  async function handlelogin() {
    const result = await login();
    if (result) {
      setErrorMessage(result);
    } else {
      notification.success("Accesso effettuato con successo!");
    }
  }

  function handlelogout() {
    logout();
    userPair = null;
    notification.info("Logout effettuato");
  }

  async function handleViewPair() {
    const gunInstance = get(gun);
    const account = getAccount(wagmiConfig);

    if (!account.isConnected) {
      setErrorMessage("Per favore connetti il tuo portafoglio Ethereum");
      return;
    }

    try {
      const signature = await gunInstance.createSignature("Accesso a GunDB con Ethereum");
      if (!signature) {
        setErrorMessage("Errore durante la firma del messaggio");
        return;
      }

      userPair = await gunInstance.getAndDecryptPair(account.address, signature);
      if (!userPair) {
        setErrorMessage("Impossibile recuperare i dati dell'utente");
      }
    } catch (error) {
      setErrorMessage("Errore durante il recupero del pair: " + error.message);
    }
  }
</script>

<main class="container mx-auto w-full p-4">
  {#if errorMessage}
    <div class="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
      <span class="block sm:inline">{errorMessage}</span>
    </div>
  {/if}

  {#if $user?.auth === false}
    <div class="bg-base-300 mx-auto my-10 mb-4 flex w-fit justify-center space-x-4 rounded-lg p-10">
      <button class="btn btn-primary" on:click={handlesignIn}><i class="fas fa-user-plus"></i> Sign In</button>
      <button class="btn btn-secondary" on:click={handlelogin}><i class="fas fa-sign-in-alt"></i> Login</button>
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
      <div class="flex justify-center space-x-4">
        <button class="btn btn-warning" on:click={handlelogout}><i class="fas fa-sign-out-alt"></i> Logout</button>
        <button class="btn btn-warning" on:click={handleViewPair}><i class="fas fa-eye"></i> Visualizza Pair</button>
      </div>
    </div>
  {/if}

  <div class="bg-base-200 mt-12 rounded-lg p-6">
    <h2 class="mb-4 text-3xl font-bold">How Authentication Works in SE-2Gun</h2>
    <ol class="list-inside list-decimal space-y-4">
      <li>
        <strong>Connect Wallet:</strong> Start by connecting your Ethereum wallet (e.g., MetaMask) to the application.
      </li>
      <li>
        <strong>signIntion:</strong>
        <ul class="ml-6 mt-2 list-inside list-disc">
          <li>Click the "Sign In" button to start signIntion.</li>
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
        <strong>Logout:</strong> Click the "Logout" (Logout) button to clear your local session. Your encrypted data remains
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
