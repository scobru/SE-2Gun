<script lang="ts">
    export let open = false;
    export let offset = '';
    export let closeButton = true;
    export let back = true;
  
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    const dispatch = createEventDispatcher();
  
    function close() {
      dispatch('close');
    }
  </script>
  
  {#if open}
    <div class="fixed w-full h-full top-0 left-0 z-50 flex flex-col items-center text-white rounded-none" transition:fade>
      {#if back}
      <div 
      class="bg-gray-800 bg-opacity-30 w-full h-full absolute z-10 cursor-pointer backdrop-filter backdrop-blur-sm" 
      on:click={close} 
      on:keydown={(e) => e.key === 'Enter' && close()}
      tabindex="0"
      role="button"
      aria-label="Chiudi"
      transition:fade
    ></div>
      {/if}
      <div 
        class="layer" 
        style="top: {offset || '10vh'}" 
        transition:fade
      >
        {#if closeButton}
          <button 
            class="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            on:click={close}
            aria-label="Close"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        {/if}
        <slot></slot>
      </div>
    </div>
  {/if}
  
  <style lang="postcss">
    .layer {
      @apply bg-white dark:bg-gray-800 rounded-3xl z-50 shadow-2xl overflow-y-scroll overscroll-contain max-h-[88vh] max-w-[98vw] relative;
      overscroll-behavior-y: none;
    }
  </style>