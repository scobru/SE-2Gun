<script>
    import { onMount } from "svelte";
    import Gun from "gun/gun";

    import DOMPurify from "dompurify";
    import { currentUser, gun } from "$lib/stores";
    import { goto } from "$app/navigation";
    import { get, writable } from "svelte/store";
    import AuthModal from "$lib/components/AuthModal.svelte";


  
    let user;
    const SEA = Gun.SEA;
    let hash = "";
    let isLoading = writable(true);
    let isEditing = false;
    let isPublic = true;
  
    let title = "";
    let author = "";
    let content = "";
    let verification = "";
    let lastUpdated = "";
    let errorMessage = "";
    let showAuthLink = false;
  
    let posts = [];
    let userPair;
  
    let gunInstance = get(gun);
  
    onMount(async () => {
      console.log("gun", get(gun));
  
      if (!gunInstance) {
        console.error("Gun instance not initialized");
        errorMessage = "Errore di inizializzazione. Riprova più tardi.";
        isLoading.set(false);
        return;
      }
  
      user = gunInstance.user();
      hash = window.location.hash.slice(1);
  
      console.log("hash", hash);
  
      userPair = JSON.parse(sessionStorage.getItem("pair"));
      console.log("UserPair caricato:", userPair);
  
      if (hash) {
        await loadPost(hash);
      } else if (!userPair || !get(currentUser)) {
        console.log("Utente non autenticato");
        errorMessage = "Please click on VIEW PAIR in the auth page";
        showAuthLink = true;
      } else {
        console.log("Utente autenticato, caricamento post...");
        await loadUserPosts();
        isEditing = false;
      }
      isLoading.set(false);
    });
  
    $: {
      if ($currentUser) {
        loadUserPosts();
      }
    }
  
    async function loadPost(postHash) {
      if (!gun) {
        console.error("Gun instance not initialized");
        errorMessage = "Errore di caricamento. Riprova più tardi.";
        return;
      }
  
      try {
        const publicPost = await new Promise((resolve, reject) => {
          gunInstance
            .get("gungra.ph")
            .get(postHash)
            .on((data, key) => {
              if (data) {
                resolve(data);
              } else {
                reject(new Error("Post non trovato"));
              }
            });
        });
  
        if (publicPost) {
          // Carica il post pubblico
          const parsedPost = JSON.parse(publicPost);
          title = DOMPurify.sanitize(parsedPost.title);
          author = DOMPurify.sanitize(parsedPost.author);
          content = DOMPurify.sanitize(parsedPost.content);
          verification = DOMPurify.sanitize(parsedPost.verification);
          lastUpdated = new Date(parsedPost.lastUpdated).toLocaleString();
          isPublic = true;
        } else if (userPair && user) {
          // Se non è un post pubblico e l'utente è autenticato, prova a caricare il post privato
          const privatePost = await new Promise((resolve, reject) => {
            user
              .get("gungra.ph")
              .get(postHash)
              .on((data, key) => {
                if (data) {
                  resolve(data);
                } else {
                  reject(new Error("Post privato non trovato"));
                }
              });
          });
  
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
          }
        } else {
          console.log("Post non trovato o non accessibile");
          errorMessage = "Post non trovato o non accessibile.";
        }
      } catch (error) {
        console.error("Errore durante il caricamento del post:", error);
        errorMessage = "Errore durante il caricamento del post.";
      }
    }
    async function loadUserPosts() {
      user = gunInstance.user();
      console.log("Inizio caricamento post utente");
      return new Promise(resolve => {
        user.get("gungra.ph").once(async data => {
          console.log("Dati ricevuti:", data);
          if (data) {
            const keys = Object.keys(data).filter(key => key !== "_");
            if (keys.length === 0) {
              console.log("Nessun post trovato");
              resolve();
              return;
            }
            for (let key of keys) {
              const encryptedData = data[key];
              console.log("Dato criptato ricevuto:", key, encryptedData);
              if (encryptedData) {
                try {
                  const decryptedData = await SEA.decrypt(encryptedData, userPair);
                  console.log("Dato decriptato:", key, decryptedData);
                  if (decryptedData) {
                    const parsedData = decryptedData;
                    updatePosts(key, parsedData, false);
                  }
                } catch (error) {
                  console.error("Errore durante la decrittazione:", error, "per la chiave:", key);
                }
              }
            }
          } else {
            console.log("Nessun post trovato");
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
      console.log("Inizio pubblicazione/modifica post", { isPublic, title, content, hash });
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
  
        if (!hash) {
          // Se non c'è un hash, stiamo creando un nuovo post
          hash = await SEA.work(postString, null, null, { name: "SHA-256" });
          console.log("Nuovo hash generato", hash);
        }
  
        if (isPublic) {
          console.log("Pubblicazione/modifica post pubblico");
          await gunInstance.get("gungra.ph").get(hash).put(postString);
        } else {
          console.log("Pubblicazione/modifica post privato");
          const encryptedData = await SEA.encrypt(postString, userPair);
          console.log("Dati criptati", encryptedData);
          await user.get("gungra.ph").get(hash).put(encryptedData);
        }
  
        // Incrementa il contatore dei post solo se stiamo creando un nuovo post
        if (!isEditing) {
          await incrementTotalPosts();
        }
  
        console.log("Post pubblicato/modificato con successo");
  
        let url = `#${hash}`;
        window.history.pushState({}, "", url);
        isEditing = false;
        await loadPost(hash);
        await loadUserPosts(); // Ricarica tutti i post dopo la pubblicazione/modifica
        posts = [...posts]; // Trigger reactivity
      } catch (error) {
        console.error("Errore durante la pubblicazione/modifica del post:", error);
        errorMessage = "Si è verificato un errore durante la pubblicazione/modifica del post.";
      }
    }
  
    async function incrementTotalPosts() {
      const totalPostsRef = gunInstance.get("gungra.ph").get("total_post");
      totalPostsRef.once(data => {
        const currentTotal = data || 0;
        totalPostsRef.put(currentTotal + 1);
      });
    }
  
    async function deletePost(postId) {
      let postRef = user.get("gungra.ph").get(postId);
      console.log("Post da eliminare:", postRef);
      await postRef.put(null); // Imposta il contenuto del nodo a null
      await user.get("gungra.ph").unset(postRef); // Rimuovi il nodo dal set
      posts = posts.filter(p => p.id !== postId);
    }
  
    function editPost(post) {
      title = post.title;
      author = post.author;
      content = post.content;
      isPublic = post.isPublic;
      verification = post.verification || "";
      hash = post.id; // Manteniamo l'hash del post esistente
      isEditing = true;
    }
  
    function newPost() {
      title = "";
      author = "";
      content = "";
      verification = "";
      hash = ""; // Resettiamo l'hash per un nuovo post
      isEditing = true;
      isPublic = true;
    }
  
    function copyLink() {
      navigator.clipboard.writeText(location.href);
    }
  
    function goBack() {
      title = "";
      author = "";
      content = "";
      verification = "";
      hash = "";
      isEditing = false;
      isLoading.set(false);
      errorMessage = "";
      loadUserPosts();
    }
  
    function goToAuth() {
      goto("/auth");
    }
  </script>
  
  <main class="container mx-auto max-w-3xl p-4">
    <!-- <h1 class="mb-4 text-center font-serif text-5xl">Gungra.ph</h1>
    <div class="mb-4 text-center text-4xl">✒️</div>
    <h3 class="mb-2 text-center text-lg text-gray-600">node: gungra.ph</h3>
    <h3 class="mb-8 text-center text-lg text-gray-600">version: 1.0.0</h3> -->
  
    {#if errorMessage}
      <div class="alert alert-error mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{errorMessage}</span>
        {#if showAuthLink}
          <button on:click={goToAuth} class="btn btn-sm btn-outline ml-2">View Pair</button>
        {/if}
      </div>
    {/if}
  
    {#if $isLoading}
      <div class="flex items-center justify-center">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    {:else if isEditing}
      <div class="form-control mx-auto w-full">
        <input
          type="text"
          bind:value={title}
          placeholder="Title"
          class="input input-ghost mb-4 w-full font-serif text-4xl focus:outline-none"
        />
        <input
          type="text"
          bind:value={author}
          placeholder="Your name"
          class="input input-ghost mb-4 w-full text-xl focus:outline-none"
        />
        <textarea
          bind:value={content}
          placeholder="Your thought..."
          class="textarea textarea-ghost mb-4 w-full rounded-none text-lg focus:outline-none"
          rows="12"
        ></textarea>
        {#if isPublic}
          <input
            type="text"
            bind:value={verification}
            placeholder="Verify your authorship with a link to a post on social media"
            class="input input-ghost mb-4 w-full focus:outline-none"
          />
        {/if}
        <label class="label cursor-pointer justify-start">
          <input type="checkbox" bind:checked={isPublic} class="checkbox mr-2" />
          <span class="label-text">Public Post</span>
        </label>
        <button on:click={publishPost} class="btn btn-primary mt-4 w-full">Publish</button>
      </div>
    {:else if hash}
      <article class="prose lg:prose-xl mx-auto">
        <h1 class="font-serif text-4xl">{title}</h1>
        <p class="text-xl text-gray-600">{author}</p>
        <div class="text-lg">{content}</div>
        {#if isPublic && verification}
          <p class="text-sm text-gray-500">Verifica: <a href={verification} class="link">{verification}</a></p>
        {/if}
        <p class="text-sm text-gray-500">Pubblicato il: {lastUpdated}</p>
        <p class="text-sm text-gray-500">Tipo: {isPublic ? "Pubblico" : "Privato"}</p>
      </article>
      <div class="mt-4 flex justify-center space-x-4">
        <button on:click={copyLink} class="btn btn-ghost">Copia Link</button>
        <button on:click={goBack} class="btn btn-ghost">Torna ai post</button>
      </div>
    {:else}
      <button on:click={newPost} class="btn btn-ghost mb-4 w-full">Write</button>
      <div class="space-y-8">
        {#each posts as post (post.id)}
          <div class="border-b pb-4">
            <h2 class="mb-2 font-serif text-2xl">{post.title}</h2>
            <p class="mb-2 text-gray-600">{post.content.substring(0, 150)}...</p>
            <p class="text-sm text-gray-500">Created: {new Date(post.lastUpdated).toLocaleString()}</p>
            <p class="text-sm text-gray-500">Type: {post.isPublic ? "Pubblico" : "Privato"}</p>
            <div class="mt-2">
              <button on:click={() => editPost(post)} class="btn btn-sm btn-ghost">Edit</button>
              {#if !post.isPublic}
                <button on:click={() => deletePost(post.id)} class="btn btn-sm btn-ghost text-red-500">Elimina</button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </main>
  <AuthModal {isLoading} />
  
  <style>
    :global(body) {
      background-color: #fff;
      color: #333;
    }
  
    input,
    textarea {
      background-color: transparent;
    }
  
    .btn-ghost {
      @apply hover:bg-gray-100;
    }
  </style>