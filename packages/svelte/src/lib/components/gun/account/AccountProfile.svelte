<script lang="ts">
    import { useAccount } from "$lib/gun/account";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import ProfileDisplay from '../profile/ProfileDisplay.svelte';
    import { useUser } from "$lib/gun/user";
    export let pub: string | undefined = "";

    let { user } = useUser();
    let globalAccount: any;
    let { account } = useAccount(pub || user?.pub);
    globalAccount = account;
    
    let lastPulse = 0;
    $: if ($globalAccount && $globalAccount.pulse !== lastPulse) {
        lastPulse = $globalAccount.pulse;
        console.log("Pulse updated:", $globalAccount.pulse);
    }
    
    onMount(() => {
        console.log("AccountProfile mounted", $globalAccount);
        let { account } = useAccount(pub || user?.pub);
        $globalAccount = account;
    });
</script>

{#if $globalAccount}
    <div class="flex flex-col items-center w-full max-w-md mx-auto">
        <h2 class="text-2xl font-bold mb-4">Account Information</h2>
        <div class="w-full">
            {#each ['pub', 'Color', 'pulse', 'Blink', 'lastSeen'] as field}
                <div class="p-2 flex items-center justify-between">
                    <div class="font-bold w-1/3">{field}</div>
                    <div class="flex items-center w-2/3">
                        {#if field === 'Color'}
                            <div class="w-5 h-5 rounded-full mr-2" style="background-color: {$globalAccount.color};"></div>
                            <span>{$globalAccount.color}</span>
                        {:else if field === 'Blink'}
                            <div>{$globalAccount.blink ? 'Yes' : 'No'}</div>
                        {:else if field === 'lastSeen'}
                            <div>{get($globalAccount.lastSeen)}</div>
                        {:else if field === 'pulse'}
                            <div>{($globalAccount.pulse)}</div>
                        {:else}
                            <div class="break-all">{$globalAccount[field.toLowerCase().replace(' ', '')]}</div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>
{:else}
    <p>Caricamento account...</p>
{/if}