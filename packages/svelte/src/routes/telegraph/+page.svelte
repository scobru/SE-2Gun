<script>
  import { onMount } from "svelte";
  import Gun from "gun";
  import "gun/sea";
  import "gun/lib/promise";
  import DOMPurify from "dompurify";
  import { currentUser, gun } from "$lib/stores";
  import { goto } from "$app/navigation"; // Importa la funzione di navigazione
  import { get } from "svelte/store";
  import { getAccount } from "@wagmi/core";
  import { wagmiConfig } from "$lib/wagmi";

  //const peers = ["https://gun-us.herokuapp.com/gun"];
  let gunInstance = get(gun) || {}; // Aggiunta di un fallback per evitare null
  let user = gunInstance.user ? gunInstance.user() : {}; // Controllo se gunInstance è valido
  const SEA = Gun.SEA;
  let myKeys = {};
  let urlPassword = "";
  let currentTitle = "";
  let hash = "";
  let isLoading = true;

  let title = "";
  let author = "";
  let content = "";
  let verification = "";
  let lastUpdated = "";
  let isEditing = false;

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tParam = urlParams.get("t");
    const pParam = urlParams.get("p");

    console.log("tParam:", tParam);
    console.log("pParam:", pParam);
    gunInstance = Gun();
    user = gunInstance.user ? gunInstance.user() : {}; // Controllo se gunInstance è valido

    if (tParam && pParam) {
      console.log("Entrato nel blocco tParam e pParam");
      urlPassword = pParam;
      hash = window.location.hash.slice(1);
      console.log("hash:", hash);
      let authorPubKey = await gunInstance.get("gun-eth.telegraph").get(hash).promOnce();
      console.log("authorPubKey:", authorPubKey);
      authorPubKey = authorPubKey.data;
      let localstorageKeyPair = localStorage.getItem(authorPubKey);
      if (localstorageKeyPair) {
        myKeys = JSON.parse(localstorageKeyPair);
        user.auth(myKeys);
        if (user.is) {
          await renderArticle(authorPubKey, hash, "update");
        }
      } else {
        await renderArticle(authorPubKey, hash, "read");
      }
    } else {
      // Controlla se l'utente è autenticato
      if (!get(currentUser)) {
        goto("/auth"); // Reindirizza alla pagina di autenticazione se non autenticato
        return;
      }

      myKeys = await SEA.pair();
      urlPassword = SEA.random(11).toString("hex");
      user.auth(myKeys);
      hash = await SEA.work(myKeys.pub, null, null, { name: "SHA-256" });
      let encPass = await SEA.encrypt(urlPassword, myKeys);
      await user.get("articles").get(hash).get("pass").promPut(encPass);
      await renderArticle(myKeys.pub, hash, "create");
    }
    isLoading = false;
  });

  async function renderArticle(authorPub, articleHash, audienceType) {
    if (audienceType === "create") {
      isEditing = true;
    } else if (audienceType === "read" || audienceType === "update") {
      await gunInstance
        .get(`~${authorPub}`)
        .get("articles")
        .get(articleHash)
        .map()
        .once(async (node, nodeID) => {
          if (nodeID !== "pass") {
            let decNode = await SEA.decrypt(node, urlPassword);
            if (nodeID === "title") {
              title = DOMPurify.sanitize(decNode);
              currentTitle = title;
            }
            if (nodeID === "author") author = DOMPurify.sanitize(decNode);
            if (nodeID === "content") content = DOMPurify.sanitize(decNode);
            if (nodeID === "verification") verification = DOMPurify.sanitize(decNode);
            if (nodeID === "lastUpdated") lastUpdated = new Date(decNode).toLocaleString();
          }
        });
    }
  }

  async function save() {
    if (isEditing) {
      await user
        .get("articles")
        .get(hash)
        .put({
          title: await SEA.encrypt(title, urlPassword),
          author: await SEA.encrypt(author, urlPassword),
          content: await SEA.encrypt(content, urlPassword),
          verification: await SEA.encrypt(verification, urlPassword),
          lastUpdated: await SEA.encrypt(new Date().toISOString(), urlPassword),
        });
    }
  }

  async function publish() {
    localStorage.setItem(myKeys.pub, JSON.stringify(myKeys));
    await gunInstance.get(`gun-eth.telegraph`).get(hash).promPut(myKeys.pub);
    let url = `?t=${encodeURIComponent(currentTitle.replace(/\s+/g, "-").toLowerCase())}&p=${encodeURIComponent(urlPassword)}#${hash}`;
    window.history.pushState({}, "", url);
    location.reload();
  }

  function copyLink() {
    navigator.clipboard.writeText(location.href);
  }
</script>

<main>
  {#if isLoading}
    <h1 class="title">Telegraph</h1>

    <h1 class="title">node: gun-eth.telegraph</h1>

    <p>Caricamento in corso...</p>
  {:else if isEditing}
    <h1 class="text-base-content mb-8 text-center text-6xl font-bold">Telegraph</h1>
    <h1 class="text-base-content mb-8 text-center text-6xl font-bold">✒️</h1>
    <h3 class="text-base-content mb-8 text-center text-2xl font-semibold">node: gun-eth.telegraph</h3>
    <input
      class="input-title my-5"
      bind:value={title}
      placeholder="Titolo"
      on:input={() => {
        currentTitle = title;
        save();
      }}
      disabled={!isEditing}
    />
    <input class="input-author" bind:value={author} placeholder="Il tuo nome" on:input={save} disabled={!isEditing} />
    <textarea
      class="input-content"
      bind:value={content}
      placeholder="La tua storia..."
      on:input={save}
      disabled={!isEditing}
    ></textarea>
    <input
      class="input-verification"
      bind:value={verification}
      placeholder="Verifica la paternità con un link a un post sui social media"
      on:input={save}
    />
    <button on:click={publish}>🔗 Crea Link</button>
  {:else}
    <article class="post">
      <h2 class="text-2xl font-bold">{title}</h2>
      <p><span class="font-semibold">{author}</span></p>
      <div class="content font-medium">{content}</div>
      {#if verification}
        <p><span class="font-base">Verifica:</span> <a href={verification}>{verification}</a></p>
      {/if}
      <p><span class="font-base">Ultimo aggiornamento:</span> {lastUpdated}</p>
    </article>
    <button class="my-5" on:click={copyLink}>🔗 Copia Link</button>
  {/if}
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  input,
  textarea {
    width: 100%;
    margin-bottom: 10px;
  }
  textarea {
    height: 200px;
  }
  .saved {
    background-color: #4caf50;
    color: white;
    padding: 10px;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .input-title,
  .input-author,
  .input-content,
  .input-verification {
    border: none;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 20px;
    background-color: #f0f0f0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .post {
    padding: 20px;
    border-radius: 5px;
  }
  .post h2 {
    font-size: 22px;
    margin-bottom: 10px;
    width: auto;
  }
  .post p {
    margin-bottom: 10px;
  }
  .post .content {
    margin-bottom: 20px;
    white-space: pre-wrap; /* Mantiene i ritorni a capo */
  }
</style>
