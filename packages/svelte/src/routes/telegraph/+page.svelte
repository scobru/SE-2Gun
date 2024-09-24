<script>
  import { onMount } from "svelte";
  import Gun from "gun";
  import "gun/sea";
  import "gun/lib/promise";
  import DOMPurify from "dompurify";
  import { currentUser, gun } from "$lib/stores";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";

  let gunInstance = get(gun) || {};
  let user;
  const SEA = Gun.SEA;
  let hash = "";
  let isLoading = true;
  let isEditing = false;
  let isPublic = true;

  let title = "";
  let author = "";
  let content = "";
  let verification = "";
  let lastUpdated = "";
  let errorMessage = "";

  let posts = [];
  let userPair;

  onMount(async () => {
    gunInstance = Gun();
    user = gunInstance.user();
    hash = window.location.hash.slice(1);

    userPair = JSON.parse(sessionStorage.getItem("pair"));
    console.log("UserPair caricato:", userPair);

    if (!userPair || !get(currentUser)) {
      console.log("Utente non autenticato, reindirizzamento a /auth");
      goto("/auth");
      return;
    }

    console.log("Utente autenticato, caricamento post...");
    await loadUserPosts();

    if (hash) {
      await loadPost(hash);
    } else {
      isEditing = false;
    }
    isLoading = false;
  });

  async function loadPost(postHash) {
    const publicPost = await gunInstance.get("gun-eth.telegraph").get("#").get(postHash).once();
    if (publicPost) {
      const parsedPost = JSON.parse(publicPost);
      title = DOMPurify.sanitize(parsedPost.title);
      author = DOMPurify.sanitize(parsedPost.author);
      content = DOMPurify.sanitize(parsedPost.content);
      verification = DOMPurify.sanitize(parsedPost.verification);
      lastUpdated = new Date(parsedPost.lastUpdated).toLocaleString();
      isPublic = true;
    } else {
      const privatePost = await user.get("gun-eth.notes").get(postHash).once();
      if (privatePost) {
        try {
          const decryptedData = await SEA.decrypt(privatePost, userPair);
          const parsedPost = JSON.parse(decryptedData);
          title = DOMPurify.sanitize(parsedPost.title);
          author = DOMPurify.sanitize(parsedPost.author);
          content = DOMPurify.sanitize(parsedPost.content);
          lastUpdated = new Date(parsedPost.lastUpdated).toLocaleString();
          isPublic = false;
        } catch (error) {
          console.error("Errore durante la decrittazione:", error);
          errorMessage = "Impossibile decrittare il post privato.";
        }
      } else {
        console.log("Post non trovato");
        errorMessage = "Post non trovato.";
      }
    }
  }

  async function loadUserPosts() {
    console.log("Inizio caricamento post utente");
    return new Promise((resolve) => {
      user.get("gun-eth.notes").once(async (data) => {
        console.log("Dati ricevuti:", data);
        if (data) {
          const keys = Object.keys(data).filter(key => key !== '_');
          for (let key of keys) {
            const encryptedData = data[key];
            console.log("Dato criptato ricevuto:", key, encryptedData);
            if (encryptedData) {
              try {
                const decryptedData = await SEA.decrypt(encryptedData, userPair);
                console.log("Dato decriptato:", key, decryptedData);
                if (decryptedData) {
                  const parsedData = JSON.parse(decryptedData);
                  updatePosts(key, parsedData, false);
                }
              } catch (error) {
                console.error("Errore durante la decrittazione:", error, "per la chiave:", key);
              }
            }
          }
        }
        console.log("Caricamento post completato");
        resolve();
      });
    });
  }

  function updatePosts(key, postData, isPublic) {
    console.log("Aggiornamento post:", key, postData, isPublic);
    const index = posts.findIndex(p => p.id === key);
    if (index > -1) {
      posts[index] = { id: key, ...postData, isPublic };
    } else {
      posts = [...posts, { id: key, ...postData, isPublic }];
    }
    posts = posts; // Trigger Svelte reactivity
    console.log("Posts aggiornati:", posts);
  }

  async function publishPost() {
    console.log("Inizio pubblicazione post", { isPublic, title, content });

    if (!title || !content) {
      errorMessage = "Titolo e contenuto sono obbligatori.";
      console.error("Errore: Titolo o contenuto mancante");
      return;
    }

    try {
      const postData = {
        title,
        author,
        content,
        verification: isPublic ? verification : "",
        lastUpdated: new Date().toISOString(),
      };

      console.log("Dati del post preparati", postData);

      const postString = JSON.stringify(postData);
      hash = await SEA.work(postString, null, null, { name: "SHA-256" });
      console.log("Hash generato", hash);

      if (isPublic) {
        console.log("Pubblicazione post pubblico");
        await gunInstance.get("gun-eth.telegraph").get("#").get(hash).put(postString);
      } else {
        console.log("Pubblicazione post privato");
        const encryptedData = await SEA.encrypt(postString, userPair);
        console.log("Dati criptati", encryptedData);
        await user.get("gun-eth.notes").get(hash).put(encryptedData);
      }

      console.log("Post pubblicato con successo");

      let url = `#${hash}`;
      window.history.pushState({}, "", url);
      isEditing = false;
      await loadPost(hash);
      await loadUserPosts(); // Ricarica tutti i post dopo la pubblicazione
      posts = [...posts]; // Trigger reactivity
    } catch (error) {
      console.error("Errore durante la pubblicazione del post:", error);
      errorMessage = "Si è verificato un errore durante la pubblicazione del post.";
    }
  }

  async function deletePost(postId) {
    await user.get("gun-eth.notes").get(postId).put(null);
    posts = posts.filter(p => p.id !== postId);
  }

  function editPost(post) {
    title = post.title;
    author = post.author;
    content = post.content;
    isPublic = post.isPublic;
    verification = post.verification || "";
    hash = post.id;
    isEditing = true;
  }

  function newPost() {
    title = "";
    author = "";
    content = "";
    verification = "";
    hash = "";
    isEditing = true;
    isPublic = true;
  }

  function copyLink() {
    navigator.clipboard.writeText(location.href);
  }
</script>

<main class="container mx-auto p-4">
  <h1 class="mb-4 text-center text-4xl font-bold">Telegraph & Notes</h1>
  <div class="mb-4 text-center text-6xl">✒️📝</div>
  <h3 class="mb-2 text-center text-xl">node: gun-eth.telegraph</h3>
  <h3 class="mb-8 text-center text-xl">version: 1.0.0</h3>

  {#if errorMessage}
    <div class="alert alert-error mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        /></svg
      >
      <span>{errorMessage}</span>
    </div>
  {/if}

  {#if isLoading}
    <div class="flex items-center justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else if isEditing}
    <div class="form-control mx-auto w-full max-w-lg">
      <input type="text" bind:value={title} placeholder="Titolo" class="input input-bordered mb-4 w-full" />
      <input type="text" bind:value={author} placeholder="Il tuo nome" class="input input-bordered mb-4 w-full" />
      <textarea
        bind:value={content}
        placeholder="Il tuo contenuto..."
        class="textarea textarea-bordered mb-4 w-full"
        rows="6"
      ></textarea>
      {#if isPublic}
        <input
          type="text"
          bind:value={verification}
          placeholder="Verifica la paternità con un link a un post sui social media"
          class="input input-bordered mb-4 w-full"
        />
      {/if}
      <label class="label cursor-pointer justify-start">
        <input type="checkbox" bind:checked={isPublic} class="checkbox mr-2" />
        <span class="label-text">Post pubblico</span>
      </label>
      <button on:click={publishPost} class="btn btn-primary mt-4">🔗 Pubblica</button>
    </div>
  {:else if hash}
    <article class="prose lg:prose-xl mx-auto">
      <h2>{title}</h2>
      <p class="font-semibold">{author}</p>
      <div>{content}</div>
      {#if isPublic && verification}
        <p>Verifica: <a href={verification} class="link">{verification}</a></p>
      {/if}
      <p>Pubblicato il: {lastUpdated}</p>
      <p>Tipo: {isPublic ? "Pubblico" : "Privato"}</p>
    </article>
    <button on:click={copyLink} class="btn btn-secondary mt-4">🔗 Copia Link</button>
  {:else}
    <button on:click={newPost} class="btn btn-primary mb-4">Nuovo Post</button>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each posts as post (post.id)}
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">{post.title}</h2>
            <p>{post.content.substring(0, 100)}...</p>
            <p class="text-sm opacity-70">Creato il: {new Date(post.lastUpdated).toLocaleString()}</p>
            <p class="text-sm opacity-70">Tipo: {post.isPublic ? "Pubblico" : "Privato"}</p>
            <div class="card-actions justify-end">
              <button on:click={() => editPost(post)} class="btn btn-sm btn-primary">Modifica</button>
              {#if !post.isPublic}
                <button on:click={() => deletePost(post.id)} class="btn btn-sm btn-error">Elimina</button>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</main>

<style>
  /* Puoi rimuovere gli stili personalizzati se non sono più necessari */
</style>
