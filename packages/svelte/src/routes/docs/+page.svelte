<script lang="ts">
  // Puoi aggiungere qui eventuali importazioni o logica necessaria
</script>

<main class="container mx-auto w-full p-4">
  <h1 class="mb-4 text-4xl font-bold">Docs</h1>
  <p class="text-base-content mb-8 text-lg">
    A Svelte-friendly wrapper for GunDB, integrating Ethereum and Web3 functionality for decentralized database
    operations in Svelte applications.
  </p>

  <section class="mb-12">
    <h2 class="mb-4 text-3xl font-semibold">Design Considerations</h2>
    <p class="mb-4">
      This library has been designed to provide a seamless integration of GunDB with Svelte applications, including
      Ethereum and Web3 functionality. Here are some key points:
    </p>
    <ul class="list-disc space-y-2 pl-5">
      <li>
        Functions are prefixed with <code class="bg-base-200 rounded px-1">create-</code> to indicate they are hooks
        (e.g.,
        <code class="bg-base-200 rounded px-1">createGun</code>,
        <code class="bg-base-200 rounded px-1">createGunPath</code>, etc.)
      </li>
      <li>
        The library maintains a single Gun instance for the main database operations and provides a method to create
        secondary instances when needed.
      </li>
      <li>
        It includes additional Gun plugins and libraries to enhance functionality, including Ethereum integration.
      </li>
      <li>Implements SHINE (Secure Hash Integrity Network Ethereum) for data verification on the blockchain.</li>
    </ul>
  </section>

  <section class="mb-12 mt-12">
    <h2 class="mb-4 text-3xl font-semibold">Getting Started</h2>
    <p class="mb-4">First, install the library:</p>
    <pre class="bg-base-200 overflow-x-auto rounded-lg p-4"><code>$ pnpm add @your-org/se-2gun</code></pre>
    <p class="my-4">Then, you can start using the Gun hooks in your Svelte components:</p>
    <pre class="bg-base-200 overflow-x-auto rounded-lg p-4"><code
        >&lt;script&gt;
      import &#123; useGun &#125; from '@your-org/se-2gun';
  
      const gun = useGun();
    &lt;/script&gt;</code
      ></pre>
  </section>

  <section class="mb-12 mt-12">
    <h2 class="mb-4 text-3xl font-semibold">Wagmi-Svelte Integration</h2>

    <p class="mb-4">
      SE-2Gun includes Wagmi-Svelte, a port of WAGMI to SvelteJS 5, to make Web3 development even easier. Derived from <a
        href="https://github.com/ByteAtATime/wagmi-svelte"
        target="_blank"
        class="link">wagmi-svelte</a
      >. Documentation <a href="wagmi-svelte.vercel.app" class="link" target="_blank">here</a>.
    </p>

    <h3 class="text-accent mb-2 text-2xl font-medium">Installation</h3>
    <pre class="bg-base-200 overflow-x-auto rounded-lg p-4"><code>$ pnpm add @byteatatime/wagmi-svelte</code></pre>

    <h3 class="text-accent mb-2 mt-4 text-2xl font-medium">Usage</h3>
    <p class="mb-2">Wrap your app with the WagmiProvider component:</p>
    <pre class="bg-base-200 overflow-x-auto rounded-lg p-4"><code
        >&lt;script&gt;
      import &#123; WagmiProvider, createWagmiConfig, http &#125; from "wagmi-svelte";
      import &#123; mainnet, sepolia &#125; from "wagmi-svelte/chains";
  
      const config = createWagmiConfig(&#123;
        chains: [mainnet, sepolia],
        transports: &#123;
          [mainnet.id]: http(),
          [sepolia.id]: http(),
        &#125;,
      &#125;);
    &lt;/script&gt;
  
    &lt;WagmiProvider &#123;config&#125;&gt;
      &lt;slot /&gt;
    &lt;/WagmiProvider&gt;</code
      ></pre>

    <h3 class="text-accent mb-2 mt-4 text-2xl font-medium">Reactivity</h3>
    <p class="mb-2">Use Wagmi hooks with $derived.by for reactivity:</p>
    <pre class="bg-base-200 overflow-x-auto rounded-lg p-4"><code
        >const &#123; address, chainId, status &#125; = $derived.by(createAccount());</code
      ></pre>
  </section>

  <section class="mb-12 mt-12">
    <h2 class="mb-4 text-3xl font-semibold">API Reference</h2>

    <div class="space-y-8">
      <div>
        <h3 class="text-accent mb-2 text-2xl font-medium">createGun</h3>
        <p class="mb-2">Creates or returns the main Gun instance for database operations.</p>
        <pre class="bg-base-200 overflow-x-auto rounded-lg p-4"><code
            >function createGun(options?: &#123; localStorage: boolean &#125;): IGunInstance &#123;&#125;</code
          ></pre>
        <p class="mt-2">Example:</p>
        <pre class="bg-base-200 overflow-x-auto rounded-lg p-4"><code
            >const gun = createGun(&#123; localStorage: false &#125;);</code
          ></pre>
      </div>

      <div>
        <h3 class="text-accent mb-2 text-2xl font-medium">verifySignature</h3>
        <p class="mb-2">Verifies an Ethereum signature for a given message.</p>
        <pre class="bg-base-200 overflow-x-auto rounded-lg p-4"><code
            >const recoveredAddress = await gun.verifySignature(message, signature);</code
          ></pre>
      </div>

      <!-- Add other API functions as needed -->
    </div>
  </section>

  <section class="mb-12 mt-12">
    <h2 class="mb-4 text-3xl font-semibold">Advanced Usage</h2>
    <h3 class="text-accent mb-2 text-2xl font-medium">SHINE Example</h3>
    <p class="mb-4">Using SHINE for data verification:</p>
    <pre class="bg-base-200 overflow-x-auto rounded-lg p-4"><code
        >const nodeId = "your-node-id-here";
  
  gun.shine("optimismSepolia", nodeId, null, (ack) => &#123;
    if (ack.ok) &#123;
      console.log("Data verified on blockchain", ack);
      console.log("Timestamp:", ack.timestamp);
      console.log("Updater:", ack.updater);
      console.log("Latest Record:", ack.latestRecord);
    &#125; else &#123;
      console.log("Data not verified or not found", ack);
    &#125;
  &#125;);</code
      ></pre>
  </section>

  <p class="bg-info rounded-lg bg-opacity-20 p-4 text-lg font-medium">
    By following this documentation, you should be able to effectively use the SE-2Gun library in your Svelte projects,
    leveraging the power of GunDB, Ethereum, and Wagmi for decentralized data management and blockchain interactions.
  </p>
</main>

<style>
</style>
