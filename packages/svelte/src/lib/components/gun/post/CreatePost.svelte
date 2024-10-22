<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { createForm } from 'svelte-forms-lib';
    import PostIcon from 'svelte-icons/io/IoIosSend.svelte';

    import { useUser } from '$lib/gun/user';

    const { user } = useUser();
    const username = $user?.name;
  
    export let onCreatePost: (text: string) => void;
    let textarea: HTMLTextAreaElement;
  
    const { form, handleSubmit, handleChange, handleReset } = createForm({
      initialValues: {
        text: ''
      },
      onSubmit: async ({ text }) => {
        if (!$user.auth || !username) {
          goto('/auth');
          return;
        }
  
        if (!text.trim()) return;
  
        onCreatePost(text);
        handleReset();
      }
    });
  
    onMount(async () => {
      textarea.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'enter' && e.metaKey) handleSubmit(e);
      });
    });
  </script>
  
  <form on:submit={handleSubmit}>
    <textarea
      name="text"
      bind:this={textarea}
      bind:value={$form.text}
      placeholder="Got something on your mind? Speak 😄"
      on:change={handleChange}
    />
    <div class="options">
      <p class="helper-block">
        <span><strong>Enter</strong> inserts a new line.</span>
        <br />
        <span>Press <strong>Ctrl+Enter (⌘+Enter)</strong> to submit.</span>
      </p>
      <button class="submit" type="submit">Post <PostIcon /></button>
    </div>
  </form>

  <style scoped>
    form {
      background-color: #9ca3af; /* Assumendo che $gray-400 sia questo colore */
      background-image: linear-gradient(111.23deg, #7D31DE 0%, #E97911 100%);
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      padding: 2px 4px 4px;
    }
  
    textarea {
      width: 100%;
      resize: none;
      border-radius: 14px;
      padding: 5px 10px 20px;
      margin-bottom: 12px;
      border: 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
      font-size: 1.125rem; /* Assumendo che @include font(lg) sia questo */
      font-family: 'Nunito', sans-serif; /* Assumendo che $nunito sia Nunito */
      background-color: #f6f9ff;
    }
  
    textarea:focus {
      outline-color: #1e40af; /* Assumendo che $primary-800 sia questo colore */
      outline-offset: 2px;
      border: 0;
    }
  
    .options {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  
    .submit {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1rem; /* Assumendo che @include font(md) sia questo */
      border-radius: 14px;
      background-color: #ffffff;
      color: #4338ca; /* Assumendo che $secondary-700 sia questo colore */
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
      padding: 10px 20px;
      border: 2px solid #ffffff;
      width: 100%;
    }
  
    .submit :global(svg) {
      margin-left: 4px;
      width: 24px;
      height: 24px;
    }
  
    .submit:hover {
      color: #3730a3; /* Assumendo che $secondary-800 sia questo colore */
      border-color: #3730a3;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    }
  
    .submit:active {
      color: #312e81; /* Assumendo che $secondary-900 sia questo colore */
      border-color: #312e81;
      background-color: #d1d5db; /* Assumendo che $gray-300 sia questo colore */
    }
  
    .helper-block {
      font-size: 0.875rem; /* Assumendo che @include font(sm) sia questo */
      color: #e5e7eb; /* Assumendo che $gray-200 sia questo colore */
      display: none;
    }
  
    @media (min-width: 640px) { /* Assumendo che sm sia 640px */
      form {
        padding: 5px 5px;
      }
  
      .submit {
        width: auto;
      }
    }
  
    @media (min-width: 768px) { /* Assumendo che md sia 768px */
      .options {
        justify-content: space-between;
      }
  
      .helper-block {
        display: block;
      }
    }
  
    @media (min-width: 1024px) { /* Assumendo che lg sia 1024px */
      form {
        padding: 20px;
      }
  
      textarea {
        padding: 10px 20px;
        border-radius: 12px;
      }
    }
  
    @media (hover: none) and (pointer: coarse) { /* Equivalente a @include touch */
      .options {
        justify-content: flex-end;
      }
  
      .helper-block {
        display: none;
      }
    }
  </style>