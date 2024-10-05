<script lang="ts">
  import {
    Icon,
    CheckCircle,
    ExclamationCircle,
    ExclamationTriangle,
    InformationCircle,
    XMark,
  } from "svelte-hero-icons";
  import toast_, { type Renderable, type Toast } from "@leodog896/svelte-french-toast";

  const {
    ...allProps
  }: {
    toast: Toast;
    status: "success" | "info" | "loading" | "error" | "warning";
    content: Renderable;
  } = $props();

  const { toast, status, content } = $derived(allProps);

  const { position, visible, icon, id } = $derived(toast);
</script>

<div
  class="bg-base-200 shadow-center shadow-accent relative flex max-w-sm transform-gpu flex-row items-start justify-between space-x-2 rounded-xl p-4 transition-all duration-500 ease-in-out {position!.substring(
    0,
    3,
  ) == 'top'
    ? `hover:translate-y-1 ${visible ? 'top-0' : '-top-96'}`
    : `hover:-translate-y-1 ${visible ? 'bottom-0' : '-bottom-96'}`}"
>
  <div class="self-center leading-[0]">
    {#if icon}
      <Icon src={icon} class="h-6 w-6" />
    {:else if status === "success"}
      <Icon src={CheckCircle} class="text-success w-7" />
    {:else if status === "loading"}
      <span class="loading loading-spinner w-6"></span>
    {:else if status === "error"}
      <Icon src={ExclamationCircle} class="text-error w-7" />
    {:else if status === "info"}
      <Icon src={InformationCircle} class="text-info w-7" />
    {:else if status === "warning"}
      <Icon src={ExclamationTriangle} class="text-warning w-7" />
    {/if}
  </div>
  <div class="overflow-x-hidden whitespace-pre-line break-words" class:mt-1={icon}>
    {#if typeof content === "string"}
      {content}
    {:else}
      <svelte:component this={content} {...allProps} />
    {/if}
  </div>

  <button class="cursor-pointer text-lg" class:mt-1={icon} onclick={() => toast_.dismiss(id)}>
    <Icon src={XMark} class="w-6 cursor-pointer" onclick={() => toast_.remove(id)} />
  </button>
</div>
