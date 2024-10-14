<script>
    import { useUser, loadUserProfile, saveUserProfile } from '$lib/gun/user';
    import { onMount } from 'svelte';
  
    const { user } = useUser();
    let profile = {};
    let editingField = null;
    let newFieldName = '';
    let newFieldValue = '';
  
    onMount(() => {
      loadUserProfile();
      return user.subscribe(u => {
        if (u.profile) {
          profile = { ...u.profile };
        }
      });
    });
  
    function updateField(field, value) {
      profile = { ...profile, [field]: value };
      saveUserProfile(profile);
      editingField = null;
    }

    function addField() {
      if (newFieldName && newFieldValue) {
        profile = { ...profile, [newFieldName]: newFieldValue };
        saveUserProfile(profile);
        newFieldName = '';
        newFieldValue = '';
      }
    }

    function removeField(field) {
      const { [field]: _, ...rest } = profile;
      profile = rest;
      saveUserProfile(profile);
    }

    $: fields = Object.keys(profile);
</script>

<div class="card w-96 bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">Profile</h2>
    {#each fields as field}
      <div class="form-control">
        <label class="label">
          <span class="label-text">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
          <button class="btn btn-xs btn-error" on:click={() => removeField(field)}>Remove</button>
        </label>
        {#if editingField === field}
          <input 
            type="text" 
            class="input input-bordered w-full max-w-xs"
            value={profile[field]} 
            on:blur={e => updateField(field, e.target.value)}
            on:keydown={e => e.key === 'Enter' && updateField(field, e.target.value)}
          />
        {:else}
          <div class="input input-bordered w-full max-w-xs flex items-center cursor-pointer" on:click={() => editingField = field}>
            {profile[field] || 'Click to edit'}
          </div>
        {/if}
      </div>
    {/each}    
    
    <div class="form-control mt-4">
      <label class="label">
        <span class="label-text">Add New Field</span>
      </label>
      <div class="flex gap-2">
        <input 
          type="text" 
          class="input input-bordered w-1/2"
          placeholder="Field Name"
          bind:value={newFieldName}
        />
        <input 
          type="text" 
          class="input input-bordered w-1/2"
          placeholder="Field Value"
          bind:value={newFieldValue}
        />
      </div>
      <button class="btn btn-primary mt-2" on:click={addField}>Add Field</button>
    </div>
  </div>
</div>

<style>
  /* Puoi aggiungere stili personalizzati qui se necessario */
</style>