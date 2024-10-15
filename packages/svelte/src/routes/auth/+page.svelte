<script lang="ts">
  import { onMount } from "svelte";
  import { wagmiConfig } from "$lib/wagmi";
  import { getAccount } from "@wagmi/core";
  import { gun } from "$lib/stores";
  import { get } from "svelte/store";
  import { notification } from "$lib/utils/scaffold-eth/notification";
  import { initializeAuth, signIn, login, logout } from "$lib/gun/auth";
  import { useUser, loadUserProfile } from "$lib/gun/user";

  import AccountProfile from "$lib/components/gun/account/AccountProfile.svelte";
  import ProfileDisplay from "$lib/components/gun/profile/ProfileDisplay.svelte";

  let errorMessage: string | null = null;
  let userPair: Record<string, any> | null = null;

  const { user } = useUser();

  let errorTimeoutId: number;

  onMount(() => {
    initializeAuth();
    return () => {
      if (errorTimeoutId) clearTimeout(errorTimeoutId);
    };
  });

  function setErrorMessage(message: string | null) {
    if (errorTimeoutId) clearTimeout(errorTimeoutId);
    errorMessage = message;
    if (message) {
      errorTimeoutId = setTimeout(() => {
        errorMessage = null;
      }, 5000);
    }
  }

  async function handleSignIn() {
    const result = await signIn();
    if (result) {
      setErrorMessage(result);
    } else {
      notification.success("Registrazione completata con successo!");
      loadUserProfile();
    }
  }

  async function handleLogin() {
    const result = await login();
    if (result) {
      setErrorMessage(result);
    } else {
      notification.success("Accesso effettuato con successo!");
      loadUserProfile();
    }
  }

  function handleLogout() {
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

<main class="container text-left justify-center">
  {#if errorMessage}
    <div class="relative mb-4 rounded border border-red-400 bg-red-100 p-20 text-red-700" role="alert">
      <span class="block sm:inline">{errorMessage}</span>
    </div>
  {/if}

  {#if $user?.auth === false}
    <div class="w-screen my-28 align-baseline text-center items-center">
      <button class="btn btn-primary" on:click={handleSignIn}><i class="fas fa-user-plus"></i> Sign In</button>
      <button class="btn btn-secondary" on:click={handleLogin}><i class="fas fa-sign-in-alt"></i> Login</button>
    </div>
  {:else}
    <div class="break-all text-center w-screen">
      <h2 class="mb-4 text-2xl font-semibold">Benvenuto, {$user?.profile?.name || $user?.pub}!</h2>
      <div class="container mx-auto my-10">
        <div class="flex flex-col lg:flex-row justify-center items-center gap-10">
          <div class="w-full lg:w-1/3">
            <svelte:component this={$user?.auth ? AccountProfile : null} pub={$user.pub} />

          </div>
          <div class="w-full lg:w-1/3">
            <svelte:component this={$user?.auth ? ProfileDisplay : null} />
          </div>
        </div>
      </div>

      {#if userPair && Object.keys(userPair).length > 0}
        <div class="items-center w-full my-10 bg-ableton-green border-ableton-blue border-2 p-5 text-left">
          <ul class="mx-auto">
            {#each Object.entries(userPair) as [key, value]}
              <li class="mb-2">
                <strong>{key}:</strong> <span class="text-base-content">{JSON.stringify(value, null, 2)}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      <div class="flex justify-center space-x-4 mx-auto mb-20 text-center">
        <button class="btn btn-primary" on:click={handleLogout}><i class="fas fa-sign-out-alt"></i> Logout</button>
        <button class="btn btn-secondary" on:click={handleViewPair}><i class="fas fa-eye"></i> Visualizza Pair</button>
      </div>
    </div>  
  {/if}

  <div class="bg-ableton-light-blue rounded-none text-black w-screen">
    <article class="prose-p:text-lg prose-ul:text-lg prose-li:text-lg prose-li:list-disc prose-li:marker:text-ableton-blue p-8">
    <h2 class="mb-10 text-5xl font-semibold ">How Authentication Works in SE-2Gun</h2>
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
    </article>
  </div>
</main>

<style>
</style>