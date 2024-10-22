<script>
  import { onMount, untrack } from "svelte";
  import DOMPurify from "dompurify";
  import { createAccount } from "@byteatatime/wagmi-svelte";
  import { notification } from "$lib/utils/scaffold-eth/notification";
  import { goto } from "$app/navigation";
  import { SEA, useGun } from "$lib/gun/gun";
  import { useUser } from "$lib/gun/user";
  import { useAvatar } from '$lib/gun/avatar';
  import { validToken } from "../../../gun.config";
  import { browser } from "$app/environment";
  import { get } from "svelte/store";

  const gun = useGun();
  const { user } = useUser();

  let messages = $state([]); // Usa $state per rendere messages reattivo
  let newMessage = "";
  let username = "";
  let userPair;
  let isInitialized = false;

  const { address,  isConnected } = $derived.by(createAccount());

  onMount(async () => {
    if (!gun) {
      console.error("Istanza Gun non inizializzata");
      notification.error("Errore di inizializzazione. Riprova più tardi.");
      return;
    }

    //user = gun.user().recall({ sessionStorage: true });
    if (!$user.auth || !$user.pub) {
      notification.warning("Utente non autenticato. Reindirizzamento alla pagina di autenticazione.");
      goto("/auth");
      return;
    }
    isInitialized = true;
  });

  $effect(() => {
    if (isInitialized && isConnected) {
      if (browser) {
        untrack(() => {
          initializeChat();
        });
      }
    }
  });

  async function initializeChat() {
    const pairString = sessionStorage.getItem("pair");
    if (pairString) {
      userPair = JSON.parse(pairString);
      await loadUserNickname();
      loadMessages();
      isInitialized = true;
    } else {
      notification.warning("Chiave pubblica mancante. Effettua l'autenticazione.");
      goto("/auth");
    }
  }

  async function loadUserNickname() {
    return new Promise(resolve => {
      if ($user.profile && $user.profile.name) {
        username = $user.profile.name;
      } else {
        username = address;
      }
      resolve();
    });
  }

  function loadMessages() {
    gun
      .get("gun-eth")
      .get("chat")
      .map()
      .on(async (data, id) => {
        console.log("Messaggio ricevuto:", data, id);
        if (data) {
          console.log("validToken", validToken);
          const decryptedMessage = await SEA.decrypt(data, validToken);
          console.log("Messaggio decriptato:", await decryptedMessage);
          const sanitizedMessage = {
            id,
            text: DOMPurify.sanitize(decryptedMessage.text),
            username: DOMPurify.sanitize(decryptedMessage.username),
            timestamp: decryptedMessage.timestamp,
            pub: decryptedMessage.pub, // Aggiungi questa riga per salvare la chiave pubblica
          };

          // Aggiorna messages in modo reattivo
          messages = messages.filter(m => m.id !== id);
          messages = [...messages, sanitizedMessage].sort((a, b) => a.timestamp - b.timestamp);
        }
      });
  }

  async function sendMessage() {
    if (!isConnected) {
      notification.error("Connetti il tuo wallet per inviare messaggi.");
      return;
    }

    if (!newMessage.trim()) {
      notification.warning("Inserisci un messaggio valido.");
      return;
    }

    const message = {
      text: newMessage,
      username: $user.profile?.name || address,
      timestamp: Date.now(),
      pub: $user.pub , // Aggiungi la chiave pubblica dell'utente
    };

    // encrypt message
    const encryptedMessage = await SEA.encrypt(message, validToken);
    await gun.get("gun-eth").get("chat").set(encryptedMessage);
    newMessage = "";
    console.log("Messaggio inviato:", message);
    // Rimuovi questa riga, non è necessaria
  }

  $effect(() => {
    console.log("Stato aggiornato:", isConnected);
  });
</script>

<main class="container mx-auto max-w-3xl p-4">
  <h1 class="mb-4 text-center font-serif text-3xl">Chat Pubblica</h1>

  {#if isConnected}
    <p class="mb-4">Benvenuto, {username}!</p>

    <div class="mb-4 h-96 overflow-y-auto border p-4">
      {#each messages as message (message.id)}
        {@const { avatar } = useAvatar(message.pub, 36)}
        <div class="flex items-start mb-4">
          <img
            class="w-9 h-9 rounded-full mr-3"
            src={get(avatar)}
            alt="Avatar"
            width={36}
            height={36}
          />
          <div class="flex-1">
            <div class="flex items-center mb-1">
              <span class="font-bold mr-2">{message.username}</span>
              <span class="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleString()}
              </span>
            </div>
            <p>{message.text}</p>
          </div>
        </div>
      {/each}
    </div>

    <div class="flex">
      <input
        type="text"
        bind:value={newMessage}
        placeholder="Scrivi un messaggio..."
        class="input input-bordered flex-grow"
      />
      <button onclick={sendMessage} class="btn btn-primary ml-2">Invia</button>
    </div>
  {:else}
    <p class="text-center">Connetti il tuo wallet per partecipare alla chat.</p>
  {/if}
</main>

<style>
  /* Aggiungi stili se necessario */
</style>
