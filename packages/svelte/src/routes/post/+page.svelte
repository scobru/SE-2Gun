<script lang="ts">
    import { onMount, beforeUpdate } from 'svelte';
  
    import CreatePost from '$lib/components/gun/post/CreatePost.svelte';
    import PostList from '$lib/components/gun/post/PostList.svelte';
    import { postStore, type PostType } from '$lib/stores/posts';
    import { useUser } from '$lib/gun/user';

    const { user } = useUser();


    const getPosts = () => {
      return Object.entries($postStore)
        .sort((a, b) => b[1].date - a[1].date)
        .map((val) => val[1]);
    };
  
    let posts: PostType[] = [];
  
    onMount(() => {
      posts = getPosts();
    });
  
    beforeUpdate(() => {
      posts = getPosts();
    });
  
    const onCreatePost = async (text: string) => {
      postStore.update(Date.now().toString(), {
        author: $user?.name,
        text,
        pub: $user?.pub,
        date: Date.now()
      });
    };
  </script>
  
  <svelte:head>
    <title>Home | SPEAK.io</title>
  </svelte:head>
  
  <div class="page">
    <main>
      <CreatePost {onCreatePost} />
      <PostList {posts} />
    </main>
  </div>
  
  <style scoped>
    .page {
        min-height: 100vh;
        background-color: #f9fafb; /* Assumendo che $gray-50 sia un grigio chiaro */
    }

    main {
        padding: 16px 16px 0;
        max-width: 1200px; /* Assumendo che @include container sia un contenitore centrato */
        margin: 0 auto;
    }

    @media (min-width: 640px) { /* Assumendo che sm sia 640px */
        main {
            padding-top: 32px;
        }
    }

    @media (min-width: 1024px) { /* Assumendo che lg sia 1024px */
        main {
            padding-left: 116px;
            padding-right: 116px;
        }
    }
  </style>
