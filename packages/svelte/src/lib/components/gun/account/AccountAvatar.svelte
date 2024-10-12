<script lang="ts">
    import { useAvatar } from '$lib/gun/avatar';
    import { useUser } from '$lib/gun/user';
    import { onMount } from 'svelte';
    
    export let pub: string = '';
    export let size: number = 42;
    export let border: number = 2;
    
    const { user } = useUser();
    let isOwnAvatar = false;
    let fileInput: HTMLInputElement;
    
    $: ({ avatar, blink, uploadAvatar, uploadStatus } = useAvatar(pub, size));
    
    onMount(() => {
        isOwnAvatar = $user.pub === pub;
        console.log("isOwnAvatar:", isOwnAvatar, "$user.pub:", $user.pub, "pub:", pub);
    });
    
    async function handleFileChange(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) await uploadAvatar(file);
    }
    </script>
    
    <div class="flex flex-col items-center justify-center relative my-10 w-fit mx-auto">
        {#if pub}
            <img
                class="border rounded-full overflow-hidden transition duration-500 ease-out"
                style="border-color: {$blink ? 'accent' : 'transparent'}; border-width: {border}px;"
                width={size}
                height={size}
                src={$avatar}
                alt="Avatar"
            />
            {#if isOwnAvatar}
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
            <div class="pb-2 px-1" style="font-size: {size}px;">
                <div class="i-la-user"></div>
            </div>
        {/if}
        <slot></slot>
    </div>