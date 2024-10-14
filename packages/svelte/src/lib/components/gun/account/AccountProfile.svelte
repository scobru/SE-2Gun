<script lang="ts">
    import { useAccount } from "$lib/gun/account";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { useUser } from "$lib/gun/user";
  import AccountAvatar from "./AccountAvatar.svelte";
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
    
    $effect(() => {
        if(user?.pub){
        console.log("AccountProfile mounted", $globalAccount);
        let { account } = useAccount(pub || user?.pub);
        $globalAccount = account;
        }
    });

    const fields = [
        { key: 'pub', label: 'Public Key' },
        { key: 'color', label: 'Color' },
        { key: 'pulse', label: 'Pulse' },
        { key: 'blink', label: 'Blink' },
        { key: 'lastSeen', label: 'Last Seen' }
    ];
</script>

<div class="card w-96 bg-base-100 shadow-xl">
    <AccountAvatar pub={$user?.pub as string} />

    <div class="card-body">
        <h2 class="card-title">Account Information</h2>
        {#if $globalAccount}
            {#each fields as { key, label }}
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">{label}</span>
                    </label>
                    {#if key === 'color'}
                        <div class="flex items-center">
                            <div class="w-6 h-6 rounded-full mr-2" style="background-color: {$globalAccount[key]};"></div>
                            <span class="badge">{$globalAccount[key]}</span>
                        </div>
                    {:else if key === 'blink'}
                        <span class="badge badge-outline">{$globalAccount[key] ? 'Yes' : 'No'}</span>
                    {:else if key === 'lastSeen'}
                        <span class="badge badge-{typeof $globalAccount[key] === 'number' ? 'success' : 'error'}">
                            {typeof $globalAccount[key] === 'number' ? `${$globalAccount[key]}s ago` : get($globalAccount[key])}
                        </span>
                    {:else if key === 'pulse'}
                        <span class="badge badge-neutral">{$globalAccount[key]}</span>
                    {:else}
                        <input type="text" readonly value={$globalAccount[key]} class="input input-bordered w-full max-w-xs text-xs" />
                    {/if}
                </div>
            {/each}
        {:else}
            <p class="text-center">Caricamento account...</p>
        {/if}
    </div>
</div>