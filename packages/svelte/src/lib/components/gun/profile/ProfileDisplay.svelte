<script lang="ts">
    import { useUser, updateProfileField, addProfileField, removeProfileField } from "$lib/gun/user";
    import { onMount } from "svelte";

    let { user } = useUser();
    let newFieldName = "";
    let newFieldValue = "";
    let editMode: { [key: string]: boolean } = {};
    let editFields: { [key: string]: string } = {};

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
        .reduce((acc, [key, value]) => {
          if (!acc.some(item => item.key.toLowerCase() === key.toLowerCase())) {
            acc.push({ key, label: key.charAt(0).toUpperCase() + key.slice(1), value });
          }
          return acc;
        }, [])
      : [];

    function handleUpdate(key: string) {
      const newValue = editFields[key];
      updateProfileField(key, newValue);
      editMode[key] = false;
      delete editFields[key];
    }

    function handleAddField() {
      if (newFieldName && newFieldValue) {
        addProfileField(newFieldName.toLowerCase(), newFieldValue);
        newFieldName = "";
        newFieldValue = "";
      }
    }

    function toggleEditMode(key: string, value: string) {
      editMode[key] = !editMode[key];
      if (editMode[key]) {
        editFields[key] = value;
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
              <span class="text-black font-medium flex-grow">{label}</span>
              <input
                type="text"
                class="input input-bordered flex-grow"
                bind:value={editFields[key]}
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
              <button class="btn btn-sm btn-outline" on:click={() => toggleEditMode(key, value)}>
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
      <div class="flex flex-col gap-2">
        <input
          type="text"
          class="input input-bordered flex-grow "
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
