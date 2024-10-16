<script lang="ts">
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { useUser } from "$lib/gun/user";
    import AccountAvatar from "./AccountAvatar.svelte";
    import { useAccount } from "$lib/gun/account";

    let pub : string | undefined ;
    let { user } = useUser();
    console.log("user pub", $user);
    let { account } = useAccount($user?.pub);

    $: globalAccount = $account;
    $: lastPulse = globalAccount?.pulse;

    onMount(() => {
        if (!pub && $user?.pub) {
            pub = $user.pub;
        }
    });

    $: pub = $user?.pub;

    


    if (globalAccount && globalAccount.pulse !== lastPulse) {
        lastPulse = globalAccount.pulse;
        console.log("Pulse updated:", globalAccount.pulse);
    }
    
    const accountFields = [
        { key: 'color', label: 'Color' },
        { key: 'pulse', label: 'Pulse' },
        { key: 'blink', label: 'Blink' },
        { key: 'lastSeen', label: 'Last Seen' }
    ];

    $: profileFields = $user.profile ? 
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
        {#if globalAccount}
            {#each accountFields as { key, label }}
                <div class="form-control gap-2">
                    <label class="label ">
                        <span class="label-text  text-black font-medium">{label}</span>
                    </label>
                    {#if key === 'color'}
                        <div class="flex items-center">
                            <div class="w-6 h-6 rounded-full " style="background-color: {globalAccount[key]};"></div>
                            <span class="badge">{globalAccount[key]}</span>
                        </div>
                    {:else if key === 'blink'}
                        <span class="badge badge-outline">{globalAccount[key] ? 'Yes' : 'No'}</span>
                    {:else if key === 'lastSeen'}
                        <span class="badge badge-{typeof globalAccount[key] === 'number' ? 'success' : 'error'}">
                            {typeof globalAccount[key] === 'number' ? `${globalAccount[key]}s ago` : get(globalAccount[key])}
                        </span>
                    {:else if key === 'pulse'}
                        <span class="badge badge-neutral">{globalAccount[key]}</span>
                    {:else}
                        <span  readonly class="w-full text-left  text-xs" >{globalAccount[key]}</span>
                    {/if}
                </div>
            {/each}
        {:else}
            <p class="text-center">Caricamento account...</p>
        {/if}

        
    </div>
</div>