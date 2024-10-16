<script lang="ts">
  import { wagmiConfig } from "$lib/wagmi";
  import { getAccount } from "@wagmi/core";
  import { notification } from "$lib/utils/scaffold-eth/notification";
  import { signIn, login, logout } from "$lib/gun/auth";
  import { useUser, loadUserProfile } from "$lib/gun/user";
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';

  //import AccountProfile from "$lib/components/gun/account/AccountProfile.svelte";
  import ProfileDisplay from "$lib/components/gun/profile/ProfileDisplay.svelte";
  import { useGun } from "$lib/gun/gun";
  import UserGraph from "$lib/components/gun/user/UserGraph.svelte";
  import GunRelay from "$lib/components/gun/relay/GunRelay.svelte";
  import { browser } from "$app/environment";

  let errorMessage: string | null = null;
  let errorTimeoutId: number;
  const userPairStore = writable(null);
  const { user } = useUser();
  let isLoading = true;

  onMount(() => {
    isLoading = false;
  });

  let AccountProfile;

  onMount(async () => {
    if (browser) {
      const module = await import('$lib/components/gun/account/AccountProfile.svelte');
      AccountProfile = module.default;
    }
    $user.auth = false;
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
    if (result === "login") {
      handleLogin();
    } else if (result) {
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
      notification.success("Login effettuato con successo!");
      loadUserProfile();
    }
  }

  function handleLogout() {
    logout();
    userPairStore.set(null);
    notification.info("Logout successful!");
  }

  async function handleViewPair() {
    const gunInstance = useGun();
    const account = getAccount(wagmiConfig);

    if (!account.isConnected) {
      setErrorMessage("Please connect your Ethereum wallet");
      return;
    }

    try {
      const signature = await gunInstance.createSignature("Accesso a GunDB con Ethereum");
      if (!signature) {
        setErrorMessage("Error signing message");
        return;
      }

      const pair = await gunInstance.getAndDecryptPair(account.address, signature);
      
      if (!pair) {
        setErrorMessage("Unable to retrieve user data");
      } else {
        userPairStore.set(pair);
      }
    } catch (error) {
      setErrorMessage("Error retrieving pair: " + error.message);
    }
  }

  $: if (errorMessage) {
    notification.error(errorMessage);
  }
</script>

<main class="text-left justify-center">
  {#if isLoading}
    <p>Caricamento...</p>
  {:else if $user?.auth === false}
    <div class="w-full my-28 align-baseline text-center items-center">
      <button class="btn btn-primary" on:click={handleSignIn}><i class="fas fa-user-plus"></i> Sign In</button>
      <button class="btn btn-secondary" on:click={handleLogin}><i class="fas fa-sign-in-alt"></i> Login</button>
    </div>
  {:else}
    <div class="break-all text-center w-full">
      <h2 class="mb-4 text-2xl font-semibold">👋 Welcome, {$user?.profile?.name || $user?.pub}!</h2>
      <div class="container mx-auto my-10 px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="w-full">
            {#if AccountProfile}
              <svelte:component this={AccountProfile} pub={$user.pub} />
  {/if}
          </div>
          <div class="w-full">
            <ProfileDisplay />
          </div>
          <div class="w-full">
            <UserGraph />
          </div>
          <div class="w-full">
            <GunRelay />
          </div>
        </div>
      </div>

      {#if $userPairStore}
        <div class="items-center w-full my-10 bg-ableton-beige border-2  text-black p-10 text-left">
          <h2 class="card-title text-black font-medium mb-10 text-3xl">User Pair</h2>
          <ul class="mx-auto">
            {#each Object.entries($userPairStore) as [key, value]}
              <li class="mb-2">
                <strong>{key}:</strong> <span class="text-black">{JSON.stringify(value, null, 2)}</span>
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
  <div class="bg-ableton-light-blue rounded-none text-black w-full mx-auto">
    <article class="prose-p:text-lg prose-ul:text-lg prose-li:text-lg prose-li:list-disc prose-li:marker:text-ableton-blue p-20">
    <h2 class="mb-10 text-5xl font-semibold break-all ">How Authentication Works in SE-2Gun</h2>
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
