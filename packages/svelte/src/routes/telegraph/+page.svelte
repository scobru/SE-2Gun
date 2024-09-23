<script>
  import { onMount } from "svelte";
  import Gun from "gun";
  import "gun/sea";
  import "gun/lib/promise";
  import DOMPurify from "dompurify";

  const peers = ['https://gun-us.herokuapp.com/gun'];
  const gun = Gun({localStorage:true, peers:peers});
  const user = gun.user();
  const SEA = Gun.SEA;
  let myKeys = {};
  let urlPassword = '';
  let currentTitle = '';
  let hash = '';
  let isLoading = true;

  let title = '';
  let author = '';
  let content = '';
  let verification = '';
  let lastUpdated = '';
  let isEditing = false;

  onMount(async () => {
    if (window.location.search) {
      urlPassword = new URLSearchParams(window.location.search).get("p");
      hash = window.location.hash.slice(1);
      let authorPubKey = await gun.get('readthis.space#').get(hash).promOnce();
      authorPubKey = authorPubKey.data;
      let localstorageKeyPair = localStorage.getItem(authorPubKey);
      if (localstorageKeyPair) {
        myKeys = JSON.parse(localstorageKeyPair);
        user.auth(myKeys);
        if (user.is) {
          await renderArticle(authorPubKey, hash, 'update');
        }
      } else {
        await renderArticle(authorPubKey, hash, 'read');
      }
    } else {
      myKeys = await SEA.pair();
      urlPassword = SEA.random(11).toString('hex');
      user.auth(myKeys);
      hash = await SEA.work(myKeys.pub, null, null, {name: "SHA-256"});
      let encPass = await SEA.encrypt(urlPassword, myKeys);
      await user.get('articles').get(hash).get('pass').promPut(encPass);
      await renderArticle(myKeys.pub, hash, 'create');
    }
    isLoading = false;
  });

  async function renderArticle(authorPub, articleHash, audienceType) {
    if (audienceType === 'create') {
      isEditing = true;
    } else if (audienceType === 'read' || audienceType === 'update') {
      await gun.get(`~${authorPub}`).get('articles').get(articleHash).map().once(async (node, nodeID) => {
        if (nodeID !== 'pass') {
          let decNode = await SEA.decrypt(node, urlPassword);
          if (nodeID === 'title') {
            title = DOMPurify.sanitize(decNode);
            currentTitle = title;
          }
          if (nodeID === 'author') author = DOMPurify.sanitize(decNode);
          if (nodeID === 'content') content = DOMPurify.sanitize(decNode);
          if (nodeID === 'verification') verification = DOMPurify.sanitize(decNode);
          if (nodeID === 'lastUpdated') lastUpdated = DOMPurify.sanitize(decNode);
        }
      });
      isEditing = audienceType === 'update';
    }
  }

  async function save() {
    let encTitle = await SEA.encrypt(title, urlPassword);
    let encAuthor = await SEA.encrypt(author, urlPassword);
    let encContent = await SEA.encrypt(content, urlPassword);
    let encVerification = await SEA.encrypt(verification, urlPassword);
    let encTime = await SEA.encrypt(new Date().toUTCString(), urlPassword);

    await user.get('articles').get(hash).get('title').promPut(encTitle);
    await user.get('articles').get(hash).get('author').promPut(encAuthor);
    await user.get('articles').get(hash).get('content').promPut(encContent);
    await user.get('articles').get(hash).get('verification').promPut(encVerification);
    await user.get('articles').get(hash).get('lastUpdated').promPut(encTime);

    currentTitle = title;
  }

  async function publish() {
    localStorage.setItem(myKeys.pub, JSON.stringify(myKeys));
    await gun.get(`readthis.space#`).get(hash).promPut(myKeys.pub); 
    let url = `?t=${encodeURIComponent(currentTitle.replace(/\s+/g, '-').toLowerCase())}&p=${urlPassword}#${hash}`;
    window.history.pushState({}, '', url);
    location.reload();
  }

  function copyLink() {
    navigator.clipboard.writeText(location.href);
  }
</script>

<main>
  <h1>ReadThis.Space</h1>

  {#if isLoading}
    <p>Caricamento in corso...</p>
  {:else}
    <input bind:value={title} placeholder="Titolo" on:input={save} disabled={!isEditing}>
    <input bind:value={author} placeholder="Il tuo nome" on:input={save} disabled={!isEditing}>
    <textarea bind:value={content} placeholder="La tua storia..." on:input={save} disabled={!isEditing}></textarea>
    
    {#if !isEditing}
      <p>Ultimo aggiornamento: {lastUpdated}</p>
      {#if verification}
        <p>Verifica: <a href={verification}>{verification}</a></p>
      {/if}
    {:else}
      <input bind:value={verification} placeholder="Verifica la paternità con un link a un post sui social media" on:input={save}>
    {/if}

    {#if isEditing}
      <button on:click={publish}>🔗 Crea Link</button>
    {:else}
      <button on:click={copyLink}>🔗 Copia Link</button>
    {/if}
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
</style>
