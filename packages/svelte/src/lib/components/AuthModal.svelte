<script lang="ts">
  import { onMount } from "svelte";
  import { wagmiConfig } from "$lib/wagmi";
  import { getAccount } from "@wagmi/core";
  import { notification } from "$lib/utils/scaffold-eth/notification";
  import { writable } from "svelte/store";
  import { signIn, login, logout, useAuth } from "$lib/gun/auth";
  import { useUser } from "$lib/gun/user";

  let isLoading = writable(false);
  let errorMessage = "";
  let account: any = null;

  const { user } = useUser();
  const { pass } = useAuth();

  $: isOpen = $user === null;


  onMount(() => {
    isLoading.set(false);
    account = getAccount(wagmiConfig);
  });

  async function registra() {
    console.log("Registrazione in corso...");
    errorMessage = "";
    isLoading.set(true);

    try {
      const result = await signIn();
      if (result) {
        errorMessage = result;
      } else {
        notification.success("Registrazione completata! Ora sei autenticato.");
      }
    } catch (error) {
      errorMessage = "Errore durante la registrazione: " + error.message;
    } finally {
      isLoading.set(false);
    }
  }

  async function accedi() {
    console.log("Accesso in corso...");
    errorMessage = "";
    isLoading.set(true);

    try {
      const result = await login();
      if (result) {
        errorMessage = result;
      } else {
        notification.success("Accesso riuscito!");
      }
    } catch (error) {
      errorMessage = "Errore durante l'accesso: " + error.message;
    } finally {
      isLoading.set(false);
    }
  }

  function esci() {
    logout();
    errorMessage = "";
  }

  function chiudiModale() {
    isOpen = false;
  }
</script>

<div class="modal" class:modal-open={isOpen}>
  <div class="modal-box">
    <h3 class="text-lg font-bold">Autenticazione</h3>

    {#if $isLoading}
      <div class="mt-4 flex items-center justify-center">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    {:else}
      {#if errorMessage}
        <div class="alert alert-error mt-4">{errorMessage}</div>
      {/if}
      {#if !$user.auth}
        <div class="mt-4 flex justify-center space-x-4">
          <button class="btn btn-primary" on:click={registra}><i class="fas fa-user-plus"></i> Registrati</button>
          <button class="btn btn-secondary" on:click={accedi}><i class="fas fa-sign-in-alt"></i> Accedi</button>
        </div>
      {:else}
        <div class="bg-base-100 mb-4 break-all rounded px-8 pb-8 pt-6 text-center shadow-md">
          <h2 class="mb-4 text-2xl font-semibold">Benvenuto, {$user.pub}!</h2>

          {#if $pass.dec.pair}
            <div class="my-5 items-center">
              <ul class="mx-auto w-2/4 text-left">
                {#each Object.entries($pass.dec.pair) as [key, value]}
                  <li class="mb-2">
                    <strong>{key}:</strong> <span class="text-base-content">{JSON.stringify(value, null, 2)}</span>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}

          <button class="btn btn-warning" on:click={esci}><i class="fas fa-sign-out-alt"></i> Esci</button>
          <button class="btn btn-warning" on:click={() => $pass.show = !$pass.show}>
            <i class="fas fa-eye"></i> {$pass.show ? 'Nascondi' : 'Mostra'} Coppia
          </button>
        </div>
      {/if}
    {/if}

    <div class="modal-action">
      <button class="btn" on:click={chiudiModale}>Chiudi</button>
    </div>
  </div>
</div>
