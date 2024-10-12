<script lang="ts">
    import { useAccount } from "$lib/gun/account";
    import { onMount } from "svelte";
    import urlRegex from "url-regex";
    
    export let pub: string | undefined = "URlViuNviAEET30fV4QgPDmGB6DMk4ZxGr-MDBVaPM4.5KaWNBz8Nvq5_yUcmJvQc6E2miOnu-z4uL7TLXbpsaw";
    
    const { account } = useAccount(pub);
    
    function isLink(text: string): boolean {
        return urlRegex({ exact: true }).test(text);
    }
    
    let lastPulse = 0;
    $: if ($account && $account.pulse !== lastPulse) {
        lastPulse = $account.pulse;
        console.log("Pulse updated:", $account.pulse);
    }
    
    onMount(() => {
        console.log("AccountProfile mounted", $account);
    });
</script>

{#if $account}
        <div class="flex flex-col break-all">
            <h2 class="text-xl font-bold mb-2">Account Information</h2>
            {#each ['pub', 'Color', 'pulse', 'Blink', 'lastSeen'] as field}
                <div class="p-2 flex items-center">
                    <div class="mr-2 font-bold" style="flex: 1 1 60px">{field}</div>
                    <div class="flex items-center ml-1" style="flex: 1 1 180px">
                        {#if field === 'Color'}
                            <div class="p-0" style="background-color: {$account.color}; width: 20px; height: 20px; border-radius: 50%;"></div>
                            <span class="ml-2">{$account.color}</span>
                        {:else if field === 'Blink'}
                            <div class="p-0">{$account.blink ? 'Yes' : 'No'}</div>
                        {:else}
                            <div class="p-0 break-all">{$account[field.toLowerCase().replace(' ', '')]}</div>
                        {/if}
                    </div>
                </div>
            {/each}
    
            <h2 class="text-xl font-bold mt-4 mb-2">Profile</h2>
            {#if $account.profile}
                {#each Object.entries($account.profile) as [field, content]}
                    <div class="p-2 flex items-center">
                        <div class="mr-2 font-bold" style="flex: 1 1 60px">{field}</div>
                        <div class="flex items-center ml-1" style="flex: 1 1 180px">
                            {#if !isLink(content as string)}
                                <div class="p-0">{content}</div>
                            {:else}
                                <a class="font-bold underline" href={content as string} target="_blank">
                                    {content}
                                </a>
                            {/if}
                        </div>
                    </div>
                {/each}
            {:else}
                <p>Nessun dato del profilo disponibile.</p>
            {/if}
        </div>
    {:else}
        <p>Caricamento account...</p>
    {/if}