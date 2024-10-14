<script lang="ts">
    import { useUser, updateProfileField, addProfileField, removeProfileField } from "$lib/gun/user";
    import { onMount } from "svelte";

    let { user } = useUser();
    let newFieldName = "";
    let newFieldValue = "";
    let editMode: { [key: string]: boolean } = {};
    let editFields: { [key: string]: { label: string, value: string } } = {};

    $: profileFields = $user.profile ? 
      Object.entries($user.profile)
        .filter(([key, value]) => 
          key !== '-' &&
          key !== '#' && 
          !key.startsWith('~') && 
          key !== '>' &&
          typeof value !== 'object' &&
          value !== null && 
          value !== undefined
        )
        .map(([key, value]) => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1), value }))
      : [];

    function handleUpdate(oldKey: string) {
      const newKey = editFields[oldKey].label.toLowerCase();
      const newValue = editFields[oldKey].value;

      if (oldKey !== newKey) {
        removeProfileField(oldKey);
        addProfileField(newKey);
      }
      updateProfileField(newKey, newValue);
      editMode[oldKey] = false;
      delete editFields[oldKey];

      // Forza l'aggiornamento dello store user
      user.update(u => ({ ...u }));
    }

    function handleAddField() {
      if (newFieldName && newFieldValue) {
        addProfileField(newFieldName.toLowerCase());
        updateProfileField(newFieldName.toLowerCase(), newFieldValue);
        newFieldName = "";
        newFieldValue = "";

        // Forza l'aggiornamento dello store user
        user.update(u => ({ ...u }));
      }
    }

    function toggleEditMode(key: string, label: string, value: string) {
      editMode[key] = !editMode[key];
      if (editMode[key]) {
        editFields[key] = { label, value };
      } else {
        delete editFields[key];
      }
    }

    onMount(() => {
      // Carica il profilo dell'utente se necessario
    });
</script>

<div class="card w-90 bg-ableton-yellow text-black rounded-none p-4 font-sans">
  <div class="card-body">
    <h2 class="card-title text-black font-medium text-2xl">Profile</h2>
    {#if profileFields.length > 0}
      {#each profileFields as { key, label, value }}
        <div class="form-control gap-2 mb-4">
          {#if editMode[key]}
            <div class="flex gap-2">
              <input
                type="text"
                class="input input-bordered flex-grow"
                bind:value={editFields[key].label}
                placeholder="Field Name"
              />
              <input
                type="text"
                class="input input-bordered flex-grow"
                bind:value={editFields[key].value}
                placeholder="Field Value"
              />
              <button 
                class="btn btn-primary" 
                on:click={() => handleUpdate(key)}
              >
                Save
              </button>
            </div>
          {:else}
            <div class="flex justify-between items-center">
              <span class="text-black font-medium">{label}</span>
              <span class="text-sm">{value}</span>
              <button class="btn btn-sm btn-outline" on:click={() => toggleEditMode(key, label, value)}>
                Edit
              </button>
            </div>
          {/if}
        </div>
      {/each}
    {:else}
      <p class="text-center">No profile information available</p>
    {/if}

    <div class="form-control gap-2 mt-4">
      <label class="label">
        <span class="label-text text-black font-medium">Add New Field</span>
      </label>
      <div class="flex gap-2">
        <input
          type="text"
          class="input input-bordered flex-grow"
          placeholder="Field Name"
          bind:value={newFieldName}
        />
        <input
          type="text"
          class="input input-bordered flex-grow"
          placeholder="Field Value"
          bind:value={newFieldValue}
        />
        <button class="btn btn-primary" on:click={handleAddField}>Add</button>
      </div>
    </div>
  </div>
</div>

<style>
  /* Puoi aggiungere stili personalizzati qui se necessario */
</style>
