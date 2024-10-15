<script lang="ts">
  import { useUser, updateProfile, addProfileField } from "$lib/gun/user";
  import { onMount } from "svelte";
  
  let { user } = useUser();
  let newFieldName = "";
  let newFieldValue = "";
  let editMode: { [key: string]: boolean } = {};
  let editFields: { [key: string]: string } = {};

  $: profileFields = Object.entries($user.profile || {});

  function handleUpdate(key: string) {
    updateProfile(key, editFields[key]);
    editMode[key] = false;
    delete editFields[key];
  }

  function handleAddField() {
    if (newFieldName && newFieldValue) {
      addProfileField(newFieldName, newFieldValue);
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
    loadUserProfile();
  });
</script>

<div class="bg-ableton-yellow text-black p-6 rounded-lg text-left w-80 font-sans">
  <h2 class="text-2xl font-semibold mb-6">Profile</h2>
  
  {#each profileFields as [key, value]}
    <div class="mb-4">
      <p class="text-sm font-medium mb-1">{key}</p>
      {#if !editMode[key]}
        <div class="bg-white rounded px-2 py-1 text-sm flex justify-between items-center">
          <span>{value}</span>
          <button 
            class="text-blue-500 text-xs"
            on:click={() => toggleEditMode(key, value)}
          >
            Edit
          </button>
        </div>
      {:else}
        <div class="flex">
          <input
            class="bg-white rounded-l px-2 py-1 text-sm flex-grow"
            bind:value={editFields[key]}
          />
          <button 
            class="bg-green-500 text-white rounded-r px-2 py-1 text-xs"
            on:click={() => handleUpdate(key)}
          >
            Save
          </button>
        </div>
      {/if}
    </div>
  {/each}
  
  <div class="mt-6">
    <input
      class="bg-white rounded px-2 py-1 text-sm w-full mb-2"
      bind:value={newFieldName}
      placeholder="New field name"
    />
    <input
      class="bg-white rounded px-2 py-1 text-sm w-full mb-2"
      bind:value={newFieldValue}
      placeholder="New field value"
    />
    <button 
      class="bg-blue-500 text-white rounded px-2 py-1 text-sm"
      on:click={handleAddField}
    >
      Add Field
    </button>
  </div>
</div>

<style>
  :global(.bg-ableton-yellow) {
    background-color: #FBFFA7;
  }
</style>
