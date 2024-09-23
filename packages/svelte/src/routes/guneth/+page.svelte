<script>
  import Gun from "gun";
  import "gun/sea";
  import { onMount } from "svelte";
  import { wagmiConfig } from "$lib/wagmi";
  import { getAccount, signMessage } from "@wagmi/core";
  import { keccak256 } from "ethers";
  import "$lib/guneth"

  let gun;
  let user;
  let currentUser = null;
  let errorMessage = "";
  let account = null;

  const MESSAGE_TO_SIGN = "Accesso a GunDB con Ethereum";

  onMount(() => {
    gun = Gun();
    user = gun.user();

    user.recall({ sessionStorage: true }, ack => {
      if(ack.err) {
        console.error("Errore nel recupero della sessione:", ack.err);
      } else if(user.is) {
        currentUser = user.is.alias;
      }
    });

    user.on("auth", () => {
      console.log("Utente autenticato:", user.is.alias);
      currentUser = user.is.alias;
    });
  });

  async function registra() {
    console.log("Registrazione in corso...");
    errorMessage = "";

    try {
      account = await  getAccount(wagmiConfig);
      console.log("Signer:",account)

      if (!account.address) {
        errorMessage = "Nessun account Ethereum connesso";
        return;
      }


      const signature = await gun.createSignature(MESSAGE_TO_SIGN)
      const recoveredAddress = await gun.verifySignature(MESSAGE_TO_SIGN,signature)

      console.log("recoveredAddress",recoveredAddress)

      if (recoveredAddress.toLowerCase() == account.address.toLowerCase()) {
        console.log("Signature Verificata")
      } else {
        console.log("Errore nella Verifica della Signature")
        return;
      }

      const password = await gun.generatePassword(signature)

      user.create(account.address, password, ack => {
        if (ack.err) {
          errorMessage = "Errore durante la registrazione: " + ack.err;
        } else {
          alert("Registrazione completata! Ora puoi accedere.");
        }
      });
    } catch (error) {
      errorMessage = "Errore durante la firma: " + error.message;
    }
  }

  async function accedi() {
    console.log("Accesso in corso...");
    errorMessage = "";

    try {
      account = await getAccount(wagmiConfig);
      if (!account.address) {
        errorMessage = "Nessun account Ethereum connesso";
        return;
      }

      const signature = await gun.createSignature(MESSAGE_TO_SIGN)
      const recoveredAddress = await gun.verifySignature(MESSAGE_TO_SIGN,signature)

      if (recoveredAddress.toLowerCase() == account.address.toLowerCase()) {
        console.log("Signature Verificata")
      } else {
        console.log("Errore nella Verifica della Signature")
        return;
      }

      const password = await gun.generatePassword(signature)

      user.auth(account.address, password, ack => {
        console.log("Risposta di autenticazione:", ack);
        if (ack.err) {
          errorMessage = "Errore di accesso: " + ack.err;
        } else {
          console.log("Accesso riuscito");
          currentUser = user.is.alias;
        }
      });
    } catch (error) {
      errorMessage = "Errore durante la firma: " + error.message;
    }
  }

  function esci() {
    user.leave();
    currentUser = null;
    errorMessage = "";
  }
</script>

<main>
  <h1>Autenticazione con GunDB e Ethereum</h1>

  {#if errorMessage}
    <div class="error">{errorMessage}</div>
  {/if}

  {#if !currentUser}
    <div>
      <button type="button" on:click={registra}>Registra con Ethereum</button>
      <button type="button" on:click={accedi}>Accedi con Ethereum</button>
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
