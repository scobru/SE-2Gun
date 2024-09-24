<script>
  import { onMount } from "svelte";
  import Gun from "gun";
  import "gun/sea";
  import { currentUser, gun } from "$lib/stores";
  import { get } from "svelte/store";

  let gunInstance;
  let user;
  let notes = [];
  let newNoteTitle = "";
  let newNoteContent = "";
  let errorMessage = "";
  let userPair;

  onMount(async () => {
    gunInstance = get(gun);
    user = gunInstance.user();

    // Recupera userPari dall Session Storage del browser brave
    userPair = JSON.parse(sessionStorage.getItem("pair"));

    if (!userPair) {
      errorMessage = "Devi essere autenticato per visualizzare le note.";
      return;
    }

    if (!get(currentUser)) {
      errorMessage = "Devi essere autenticato per visualizzare le note.";
      return;
    }

    console.log("Inizio caricamento note...");
    user
      .get("gun-eth.notes")
      .map()
      .on(async (encryptedData, key) => {
        console.log("Dato criptato ricevuto:", key, encryptedData);
        if (encryptedData) {
          try {
            const decryptedData = await Gun.SEA.decrypt(encryptedData, userPair);
            console.log("Nota decritta:", key, decryptedData);
            if (decryptedData) {
              updateNotes(key, decryptedData);
            }
          } catch (error) {
            console.error("Errore durante la decrittazione:", error);
          }
        }
      });
  });

  async function addNote() {
    if (!newNoteTitle || !newNoteContent) {
      errorMessage = "Titolo e contenuto sono obbligatori.";
      return;
    }

    if (!userPair) {
      errorMessage = "Devi essere autenticato per aggiungere una nota.";
      return;
    }

    try {
      const noteData = {
        title: newNoteTitle,
        content: newNoteContent,
        createdAt: Date.now(),
      };

      const encryptedData = await Gun.SEA.encrypt(JSON.stringify(noteData), userPair);
      const noteId = Gun.SEA.random(16).toString("hex");

      // Usa lo spazio utente corretto
      await user.get('gun-eth.notes').get(noteId).put(encryptedData);

      newNoteTitle = "";
      newNoteContent = "";
      errorMessage = "";
      console.log("Nota aggiunta con successo:", noteId);
    } catch (error) {
      console.error("Errore durante l'aggiunta della nota:", error);
      errorMessage = "Si è verificato un errore durante l'aggiunta della nota.";
    }
  }

  function updateNotes(key, decryptedData) {
    console.log("Aggiornamento note:", key, decryptedData);
    const parsedData = typeof decryptedData === "string" ? JSON.parse(decryptedData) : decryptedData;
    const noteIndex = notes.findIndex(n => n.id === key);
    if (noteIndex > -1) {
      notes[noteIndex] = { id: key, ...parsedData };
    } else {
      notes = [...notes, { id: key, ...parsedData }];
    }
    notes = notes;
    console.log("Note aggiornate:", notes);
  }

  async function deleteNote(noteId) {
    await user.get("gun-eth.notes").get(noteId).put(null);
    notes = notes.filter(n => n.id !== noteId);
    console.log("Nota eliminata:", noteId);
  }
</script>

<main class="container mx-auto p-4">
  <h1 class="text-base-content mb-8 text-center text-6xl font-bold">Notes</h1>

  <h1 class="text-base-content mb-8 text-center text-6xl font-bold">📝</h1>
  <h3 class="text-base-content mb-8 text-center text-2xl font-semibold">node: gun-eth.notes</h3>
  <h3 class="text-base-content mb-8 text-center text-2xl font-semibold">version: 1.0.0</h3>
  {#if errorMessage}
    <p class="mb-4 text-red-500">{errorMessage}</p>
  {/if}

  <div class="mb-4">
    <input
      type="text"
      bind:value={newNoteTitle}
      placeholder="Titolo della nota"
      class="mb-2 w-full rounded border p-2"
    />
    <textarea
      bind:value={newNoteContent}
      placeholder="Contenuto della nota"
      class="mb-2 w-full rounded border p-2"
      rows="4"
    ></textarea>
    <button on:click={addNote} class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
      Aggiungi Nota
    </button>
  </div>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each notes as note (note.id)}
      <div class="rounded bg-white p-4 shadow">
        <h2 class="mb-2 text-xl font-bold">{note.title}</h2>
        <p class="mb-2">{note.content}</p>
        <p class="text-sm text-gray-500">Creata il: {new Date(note.createdAt).toLocaleString()}</p>
        <button
          on:click={() => deleteNote(note.id)}
          class="mt-2 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
        >
          Elimina
        </button>
      </div>
    {/each}
  </div>
</main>
