<script lang="ts">
    import {  writable } from "svelte/store";
    import { useUser } from "$lib/gun/user";
    import AccountAvatar from "./AccountAvatar.svelte";

    let { user } = useUser();
    let account = writable(null);
    let lastPulse: any;


    $: if ($account) {
        console.log("Account data updated:", $account);
        if ($account.pulse !== lastPulse) {
            lastPulse = $account.pulse;
            console.log("Pulse updated:", $account.pulse);
        }
    }
    
    const accountFields = [
        { key: 'pulse', label: 'Pulse' },
        { key: 'blink', label: 'Blink' },
        { key: 'lastSeen', label: 'Last Seen' }
        
    ];

    $: profileFields = $user?.profile ? 
        Object.entries($user.profile)
            .filter(([key, value]) => 
                key !== '#' && 
                !key.startsWith('~') && 
                typeof value !== 'object' &&
                value !== null && 
                value !== undefined
            )
            .map(([key, value]) => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1), value }))
        : [];
</script>

<div class="card w-90 bg-ableton-light-blue text-black rounded-none p-4 font-sans">
    <div class="card-body">
        <h2 class="card-title text-black font-medium text-2xl">Account Information</h2>
        <AccountAvatar pub={$user?.pub} />
        {#if $user}
            {#each accountFields as { key, label }}
                <div class="form-control gap-2">
                    <label class="label">
                        <span class="label-text text-black font-medium">{label}</span>
                    </label>
                    {#if key === 'color'}
                        <div class="flex items-center">
                            <div class="w-6 h-6 rounded-full" style="background-color: {$user[key] || 'transparent'};"></div>
                            <span class="badge">{$account[key] || 'N/A'}</span>
                        </div>
                    {:else if key === 'blink'}
                        <span class="badge badge-outline">{$user[key] === false ? 'No' : ($user[key] ? 'Yes' : 'N/A')}</span>
                    {:else if key === 'lastSeen'}
                        <span class="badge badge-{typeof $user[key] === 'number' ? 'success' : 'error'}">
                            {typeof $user[key] === 'number' ? `${$user[key]}s ago` : ($user[key] || 'N/A')}
                        </span>
                    {:else if key === 'pulse'}
                        <span class="badge badge-neutral">{$user[key] || 'N/A'}</span>
                    {:else}
                        <span readonly class="w-full text-left text-xs">{$user[key] || 'N/A'}</span>
                    {/if}
                </div>
            {/each}
        {:else}
            <p class="text-center">Caricamento account... (Pub: {$user?.pub})</p>
        {/if}
    </div>
</div>