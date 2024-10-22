<script lang="ts">
    import type { PostType } from '$lib/stores/posts';
    import Post from './Post.svelte';
  
    export let posts: PostType[];
</script>

<div class="post-container">
    {#if !posts || !posts.length}
      <p>Loading...</p>
    {/if}
  
    {#each posts as post}
      <Post author={post.author} text={post.text} timestamp={post.date} pub={post.pub} />
    {/each}
</div>

<style scoped>
    .post-container {
        padding-top: 32px;
    }

    .post-container p {
        width: 100%;
        text-align: center;
        color: #718096; /* Assumendo che $gray-600 sia un grigio medio */
        font-size: 1rem; /* Assumendo che @include font(md) sia una dimensione del font media */
        line-height: 1.5; /* Valore comune per line-height */
    }
</style>
