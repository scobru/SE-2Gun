<script>
  import Gun from "gun";
  import "gun/sea";
  import { onMount } from "svelte";

  let gun;
  let user;
  let username = $state(""); // Rimosso $: e inizializzato come stringa vuota
  let password = $state(""); // Rimosso $: e inizializzato come stringa vuota
  let currentUser = null;
  let errorMessage = "";

  onMount(() => {
    gun = Gun();
    user = gun.user();

    // Controlla se l'utente è già autenticato al caricamento del componente
    user.recall({ sessionStorage: true });

    // Ascolta l'evento 'auth' per aggiornare l'utente corrente
    user.on("auth", () => {
      console.log("Utente autenticato:", user.is.alias);
      currentUser = user.is.alias;
    });
  });

  function registra() {
    console.log("Registrazione in corso...");

    errorMessage = "";

    if (!username || !password) {
      errorMessage = "Per favore, inserisci sia username che password.";
      return;
    }
    user.create(username, password, ack => {
      if (ack.err) {
        errorMessage = "Errore durante la registrazione: " + ack.err;
      } else {
        alert("Registrazione completata! Ora puoi accedere.");
      }
    });
  }

  function accedi() {
    console.log("Accesso in corso...");
    errorMessage = "";
    console.log("Username:", username);
    console.log("Password:", password);
    if (!username || !password) {
      errorMessage = "Per favore, inserisci sia username che password.";
      return;
    }
    user.auth(username, password, ack => {
      console.log("Risposta di autenticazione:", ack);
      if (ack.err) {
        errorMessage = "Errore di accesso: " + ack.err;
      }
      console.log(user);
      currentUser = user.is.alias;
    });
  }

  function esci() {
    user.leave();
    currentUser = null;
    username = "";
    password = "";
    errorMessage = "";
  }
</script>

$: {console.log(username, password)}

<main>
  <h1>Autenticazione con GunDB in Svelte</h1>

  {#if errorMessage}
    <div class="error">{errorMessage}</div>
  {/if}

  {#if !currentUser}
    <div>
      <input type="text" bind:value={username} placeholder="Nome utente" />
      <input type="password" bind:value={password} placeholder="Password" />
      <button type="button" on:click|preventDefault={registra}>Registra</button>
      <button type="button" on:click|preventDefault={accedi}>Accedi</button>
    </div>
  {:else}
    <div>
      <h2>Benvenuto, {currentUser}!</h2>
      <button on:click={esci}>Esci</button>
    </div>
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  .error {
    color: red;
    margin-bottom: 10px;
  }
</style>
