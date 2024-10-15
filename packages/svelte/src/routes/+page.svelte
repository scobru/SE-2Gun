<script lang="ts">
  import { Address } from "$lib/components/scaffold-eth";
  import { createAccount } from "@byteatatime/wagmi-svelte";
  import { Icon, DocumentCheck } from "svelte-hero-icons";
  const { address } = $derived.by(createAccount());
  import logo from "$lib/assets/logo.svg";
</script>

<div class="flex flex-grow flex-col items-center font-sans">
  <div class="px-5">
    <h1 class="text-center">
      <span class="mb-2 block text-2xl">Welcome to</span>
      <span class="block text-7xl font-semibold">Scaffold-ETH2Gun</span>
      <img src={logo} class="mx-auto h-56 w-56" />
    </h1>
    <div class="flex items-center justify-center space-x-2">
      <p class="my-2 font-medium">Connected Address:</p>
      <Address {address} />
    </div>
  </div>

  <div class="my-8 min-w-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 py-8 text-center text-white">
    <h2 class="mb-2 text-4xl font-bold">Live on Optimism Sepolia!</h2>
  </div>

  <div class=" mt-16 w-full flex-grow px-8 py-12">
    <div class="flex flex-col items-center justify-center gap-12 sm:flex-row">
      <div class="flex max-w-xs flex-col items-center rounded-3xl px-10 py-10 text-center">
        <img
          src="https://camo.githubusercontent.com/e79cc2fa3e42c4007e7d23e3827768b233b019fef64edf9aeb591c02ca8f958a/68747470733a2f2f636c6475702e636f6d2f5445793979476834356c2e737667"
          class="h-auto w-auto"
          alt=""
        />
      </div>
      <div class="flex max-w-xs flex-col items-center rounded-3xl px-10 py-10 text-center">
        <h2 class="text-5xl font-bold">➕</h2>
      </div>
      <div class=" flex max-w-xs flex-col items-center rounded-3xl px-10 py-10 text-center">
        <img src="https://scaffoldeth.io/logo.svg" alt="" class="h-auto w-auto" />
      </div>
    </div>
  </div>
</div>

<div class="card-actions mt-6 justify-center rounded-lg">
  <a
    href="https://github.com/scobru/SE-2Gun"
    target="_blank"
    rel="noopener noreferrer"
    class="btn btn-primary btn-lg my-10 rounded-lg"
  >
    <Icon src={DocumentCheck} class="mr-2 h-6 w-6" />
    Fork the Repo
  </a>
</div>
<div class="card bg-ableton-light-blue mx-auto w-fit rounded-none text-black">
  <!-- Project Origin and Documentation Links -->
  <div class="bg-ableton-yellow flex w-full p-10 text-black">
    <div class="w-1/2 p-4">
      <h2 class="mb-4 text-5xl font-semibold">Project Origin and Documentation</h2>
      <p class="mb-4 text-xl">
        SE-2Gun is based on Scaffold-ETH, a framework for rapid development of decentralized applications (dApps) on
        Ethereum.
      </p>
      <p class="mb-4 text-xl">
        The project integrates GunDB for decentralized data management and Wagmi for Ethereum interaction.
      </p>
    </div>
    <div class="w-1/2 p-4">
      <h3 class="mb-4 text-3xl font-medium">Useful Links:</h3>
      <ul class="list-disc space-y-2 pl-5 text-xl">
        <li>
          <a href="https://scaffoldeth.io" class=" hover:underline" target="_blank" rel="noopener noreferrer">
            Scaffold-ETH Documentation
          </a>
        </li>
        <li>
          <a href="https://gun.eco/docs/" class=" hover:underline" target="_blank" rel="noopener noreferrer">
            GunDB Documentation
          </a>
        </li>
        <li>
          <a href="https://wagmi.sh/" class=" hover:underline" target="_blank" rel="noopener noreferrer">
            Wagmi Documentation
          </a>
        </li>
        <li>
          <a
            href="https://github.com/ByteAtATime/wagmi-svelte"
            class=" hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wagmi Svelte
          </a>
        </li>
        <li>
          <a
            href="https://github.com/scobru/SE-2Gun/tree/main/packages/gun-eth"
            class=" hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gun Eth (Plugin for GunDB)
          </a>
        </li>
        <li>
          <a
            href="https://github.com/scobru/se-2gun"
            class=" hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            SE-2Gun GitHub Repository (Main)
          </a>
        </li>
      </ul>
    </div>
  </div>
  <div class="card-body justify-stretch leading-8">
    <article
      class="prose-p:text-xl prose-ul:text-lg prose-li:text-lg prose-li:list-disc prose-li:marker:text-ableton-blue prose-h2:text-5xl prose-h2:font-semibold prose-h2:antialiased justify-center p-4"
    >
      <h2 class="card-title mb-10 text-5xl font-semibold antialiased">What is SE-2Gun?</h2>
      <p class="font-base mt-4 text-2xl leading-relaxed text-black">
        SE-2Gun is a cutting-edge decentralized application (dApp) built with Svelte and GunDB, seamlessly integrated
        with Ethereum for robust authentication and data encryption. This project aims to provide a fully decentralized
        platform where users can create unique pair and store into GunDB. By leveraging Ethereum signatures, SE-2Gun
        ensures data integrity and privacy through advanced encryption techniques.
      </p>
    </article>
  </div>
</div>
<div class="card text-base-content mx-auto w-full rounded-none">
  <div class="card-body">
    <article
      class="prose-p:text-xl prose-ul:text-lg prose-li:text-lg prose-li:list-disc prose-li:marker:text-ableton-blue p-4"
    >
      <h2 class=" mb-10 mt-6 text-5xl font-semibold">Why SE-2Gun?</h2>
      <ul class="text-base-content font-base mt-4 list-inside list-disc text-xl">
        <p>
          <span class="font-bold">Fully Decentralized:</span> SE-2Gun is designed to be a completely decentralized application,
          eliminating the need for centralized servers and ensuring that users have full control over their data.
        </p>
        <p>
          <span class="font-bold">Efficient Data Storage:</span> By using GunDB, SE-2Gun stores only the necessary data on
          the blockchain, optimizing storage costs and improving performance.
        </p>
        <p>
          <span class="font-bold">Ethereum-Based Encryption:</span> SE-2Gun generates cryptographic pairs using Ethereum
          addresses, providing a secure and reliable method for data encryption and user authentication.
        </p>
      </ul>
    </article>
  </div>
</div>
<div class="card bg-ableton-beige mx-auto w-full rounded-none text-black">
  <div class="card-body">
    <article
      class="prose-p:text-xl prose-h2:text-5xl prose-h2:font-semibold prose-h2:antialiased prose-ul:text-lg prose-li:text-lg prose-li:list-disc prose-li:marker:text-ableton-blue p-4"
    >
      <h2 class="card-title mb-10 mt-6 text-6xl font-bold">Technology Stack</h2>
      <ul class=" font-base mt-4 list-inside list-disc text-3xl">
        <p><span class="font-bold">GunDB:</span> A decentralized database for secure data storage and retrieval.</p>
        <p>
          <span class="font-bold">Scaffold-ETH:</span> A development framework that combines Svelte and Hardhat for building
          and deploying Ethereum smart contracts.
        </p>
        <p>
          <span class="font-bold">Svelte:</span> A modern JavaScript framework for building fast and reactive user interfaces.
        </p>
        <p>
          <span class="font-bold">Hardhat:</span> A development environment for Ethereum software, allowing for testing,
          deployment, and debugging of smart contracts.
        </p>
      </ul>
    </article>
  </div>
</div>

<div class="card text-base-content mx-auto w-fit rounded-none">
  <div class="card-body">
    <article
      class="prose-p:text-lg prose-h2:text-5xl prose-h2:font-semibold prose-h2:antialiased prose-ul:text-lg prose-li:text-lg prose-li:list-disc prose-li:marker:text-ableton-blue p-4"
    >
      <h2 class="card-title mb-10 text-5xl font-semibold">Contribute as a Relay</h2>
      <p class=" font-base mt-4 text-lg">
        SE-2Gun relies on a network of relays to ensure data availability and resilience. By becoming a relay, you can
        play a crucial role in maintaining the decentralized nature of the network. Here's how you can contribute:
      </p>
      <ul class=" font-base mt-4 list-inside list-disc text-lg">
        <p>
          <span class="font-bold">Set Up a Node:</span> Install and configure a GunDB node on your server or personal computer.
        </p>
        <p>
          <span class="font-bold">Connect to the Network:</span> Use the provided configuration to connect your node to the
          SE-2Gun network.
        </p>
        <p>
          <span class="font-bold">Maintain Uptime:</span> Ensure your node remains online to contribute to the network's
          reliability.
        </p>
        <p>
          <span class="font-bold">Monitor Performance:</span> Keep an eye on your node's performance and resource usage.
        </p>
      </ul>
      <h3 class="mt-4 text-2xl font-semibold">
        By running a relay, you help distribute data across the network, improving access speeds and ensuring data
        persistence. Your contribution strengthens the decentralized infrastructure that powers SE-2Gun.
      </h3>
      <div class="card-actions mt-6 justify-center">
        <a
          href="#"
          class="btn btn-primary dark:text-base-content text-ableton-blue border-2 bg-transparent hover:bg-transparent hover:font-bold"
          >Learn More About Becoming a Relay</a
        >
      </div>
    </article>
  </div>
</div>

<style>
</style>
