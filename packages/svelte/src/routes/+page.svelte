<script lang="ts">
  import { Address } from "$lib/components/scaffold-eth";
  import { createAccount } from "@byteatatime/wagmi-svelte";
  import { Icon, DocumentCheck } from "svelte-hero-icons";
  const { address } = $derived.by(createAccount());
</script>

<div class="flex flex-grow flex-col items-center pt-10">
  <div class="px-5">
    <h1 class="text-center">
      <span class="mb-2 block text-2xl">Welcome to</span>
      <span class="block text-8xl font-bold">Scaffold-ETH2Gun</span>
    </h1>
    <div class="flex items-center justify-center space-x-2">
      <p class="my-2 font-medium">Connected Address:</p>
      <Address {address} />
    </div>
  </div>

  <div class="my-8 w-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 py-8 text-center text-white">
    <h2 class="mb-2 text-4xl font-bold">Live on Optimism Sepolia!</h2>
  </div>

  <div class="bg-base-300 mt-16 w-full flex-grow px-8 py-12">
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

<div class="card text-base-content bg-base-300 mx-auto my-8 max-w-4xl rounded-2xl p-10">
  <div class="card-body">
    <h2 class="card-title text-primary text-5xl font-extrabold">What is SE-2Gun?</h2>
    <p class="text-base-content mt-4 text-lg font-medium">
      SE-2Gun is a cutting-edge decentralized application (dApp) built with Svelte and GunDB, seamlessly integrated with
      Ethereum for robust authentication and data encryption. This project aims to provide a fully decentralized
      platform where users can create unique pair and store into GunDB. By leveraging Ethereum signatures, SE-2Gun
      ensures data integrity and privacy through advanced encryption techniques.
    </p>
    <h3 class="text-primary mt-6 text-4xl font-bold">Why SE-2Gun?</h3>
    <ul class="text-base-content mt-4 list-inside list-disc text-lg font-medium">
      <li>
        <span class="font-bold">Fully Decentralized:</span> SE-2Gun is designed to be a completely decentralized application,
        eliminating the need for centralized servers and ensuring that users have full control over their data.
      </li>
      <li>
        <span class="font-bold">Efficient Data Storage:</span> By using GunDB, SE-2Gun stores only the necessary data on
        the blockchain, optimizing storage costs and improving performance.
      </li>
      <li>
        <span class="font-bold">Ethereum-Based Encryption:</span> SE-2Gun generates cryptographic pairs using Ethereum addresses,
        providing a secure and reliable method for data encryption and user authentication.
      </li>
    </ul>
    <h3 class="text-primary mt-6 text-4xl font-bold">Technology Stack</h3>
    <ul class="text-base-content mt-4 list-inside list-disc text-lg font-medium">
      <li><span class="font-bold">GunDB:</span> A decentralized database for secure data storage and retrieval.</li>
      <li>
        <span class="font-bold">Scaffold-ETH:</span> A development framework that combines Svelte and Hardhat for building
        and deploying Ethereum smart contracts.
      </li>
      <li>
        <span class="font-bold">Svelte:</span> A modern JavaScript framework for building fast and reactive user interfaces.
      </li>
      <li>
        <span class="font-bold">Hardhat:</span> A development environment for Ethereum software, allowing for testing, deployment,
        and debugging of smart contracts.
      </li>
    </ul>
  </div>
</div>
<div class="card text-base-content bg-base-300 mx-auto my-8 max-w-4xl rounded-2xl p-10">
  <div class="card-body">
    <h2 class="card-title text-primary text-4xl font-extrabold">Contribute as a Relay</h2>
    <p class="text-base-content mt-4 text-lg font-medium">
      SE-2Gun relies on a network of relays to ensure data availability and resilience. By becoming a relay, you can
      play a crucial role in maintaining the decentralized nature of the network. Here's how you can contribute:
    </p>
    <ul class="text-base-content mt-4 list-inside list-disc text-lg font-medium">
      <li>
        <span class="font-bold">Set Up a Node:</span> Install and configure a GunDB node on your server or personal computer.
      </li>
      <li>
        <span class="font-bold">Connect to the Network:</span> Use the provided configuration to connect your node to the
        SE-2Gun network.
      </li>
      <li>
        <span class="font-bold">Maintain Uptime:</span> Ensure your node remains online to contribute to the network's reliability.
      </li>
      <li>
        <span class="font-bold">Monitor Performance:</span> Keep an eye on your node's performance and resource usage.
      </li>
    </ul>
    <p class="text-base-content mt-4 text-lg font-medium">
      By running a relay, you help distribute data across the network, improving access speeds and ensuring data
      persistence. Your contribution strengthens the decentralized infrastructure that powers SE-2Gun.
    </p>
    <div class="card-actions mt-6 justify-center">
      <a href="#" class="btn btn-primary">Learn More About Becoming a Relay</a>
    </div>
  </div>
</div>

<style>
</style>
