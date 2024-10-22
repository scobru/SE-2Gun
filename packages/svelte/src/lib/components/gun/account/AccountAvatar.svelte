<script lang="ts">
  import { browser } from '$app/environment';
    import { useAvatar } from '$lib/gun/avatar';
    import { useUser } from '$lib/gun/user';
    import { onMount, createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    const { user } = useUser();

    export let size: number = 96;
    export let border: number = 2;
    
    let fileInput: HTMLInputElement;
    let avatarLoaded = false;
    


   
        let { avatar: avatarStore, blink, uploadAvatar, uploadStatus, updateAvatar } =  useAvatar($user.pub || "", size);
      
    
   
    onMount(() => {
        if(typeof window !== "undefined") {
            updateAvatar();
        }
    });
    
    async function handleFileChange(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            await uploadAvatar(file);
            updateAvatar();
        }
    }

    function onAvatarLoad() {
        avatarLoaded = true;
        dispatch('load');
    }

    function onAvatarError() {
        avatarLoaded = true;
        updateAvatar();
        dispatch('load');
    }
</script>

<div class="flex flex-col items-center justify-center relative w-fit">
    {#if $user.pub}
        <img
            class="border rounded-full overflow-hidden transition duration-500 ease-out"
            style="border-color: {$blink ? 'accent' : 'transparent'}; border-width: {border}px;"
            width={size}
            height={size}
            src={$avatarStore}
            alt="Avatar"
            on:load={onAvatarLoad}
            on:error={onAvatarError}
        />
        {#if  avatarLoaded}
            <button
                class="absolute bottom-0 right-0 bg-accent text-white rounded-full p-1 hover:bg-accent/80"
                on:click={() => fileInput.click()}
            >
                <div class="i-la-camera" style="font-size: {size / 3}px;"></div>
            </button>
            <input
                bind:this={fileInput}
                type="file"
                accept="image/*"
                on:change={handleFileChange}
                class="hidden"
            />
            {#if $uploadStatus}
                <div class="mt-2 text-sm text-gray-600">{$uploadStatus}</div>
            {/if}
        {/if}
    {:else}
        <img
            class="border rounded-full overflow-hidden"
            style="border-width: {border}px;"
            width={size}
            height={size}
            src={`https://avatars.dicebear.com/api/identicon/${$user.pub}.svg?size=${size}`}
            alt="Default Avatar"
        />
    {/if}
    <slot></slot>
</div>
