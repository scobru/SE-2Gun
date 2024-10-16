<script lang="ts">
  import { useUser, updateProfile, addProfileField , loadUserProfile} from "$lib/gun/user";
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

<div class="profile-container font-sans text-left">
  <h2 class="profile-title font-sans  font-semibold antialiased text-2xl">Profile</h2>
  {#each profileFields as [key, value]}
    <div class="profile-field">
      <p class="field-label">{key}</p>
      {#if !editMode[key]}
        <div class="field-value">
          <span>{value}</span>
          <button 
            class="edit-button"
            on:click={() => toggleEditMode(key, value)}
          >
            Edit
          </button>
        </div>
      {:else}
        <div class="edit-field">
          <input
            class="edit-input"
            bind:value={editFields[key]}
          />
          <button 
            class="save-button"
            on:click={() => handleUpdate(key)}
          >
            Save
          </button>
        </div>
      {/if}
    </div>
  {/each}
  
  <div class="add-field">
    <input
      class="add-input"
      bind:value={newFieldName}
      placeholder="New field name"
    />
    <input
      class="add-input"
      bind:value={newFieldValue}
      placeholder="New field value"
    />
    <button 
      class="add-button"
      on:click={handleAddField}
    >
      Add Field
    </button>
  </div>
</div>

<style>
  .profile-container {
    background-color: #FBFFA7;
    color: #000000;
    padding: 40px;
  }

  .profile-title {
    font-size: 24px;
    margin-bottom: 24px;
  }

  .profile-field {
    margin-bottom: 16px;
  }

  .field-label {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .field-value, .edit-field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #FFFFFF;
    border: 1px solid #000000;
  }

  .field-value {
    padding: 8px;
  }

  .edit-input, .add-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #000000;
    margin-bottom: 8px;
  }

  .edit-button, .save-button, .add-button {
    background-color: #000000;
    color: #FFFFFF;
    border: none;
    padding: 4px 8px;
    font-size: 12px;
    cursor: pointer;
  }

  .edit-field {
    display: flex;
  }

  .edit-field .edit-input {
    flex-grow: 1;
    margin-bottom: 0;
    border-right: none;
  }

  .edit-field .save-button {
    border-left: 1px solid #000000;
  }

  .add-field {
    margin-top: 24px;
  }

  .add-button {
    width: 100%;
    padding: 8px;
  }
</style>