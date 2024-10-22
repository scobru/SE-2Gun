<script lang="ts">
  import { useGun } from "$lib/gun/gun";
  import { gun } from "$lib/stores";

  const gunInstance = useGun();

  $effect(() => {
    gun.set(gunInstance);
  });
</script>

<div class="flex min-h-screen flex-col">
  <slot />
</div>
