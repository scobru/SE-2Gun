<script lang="ts">
  import { Address } from "$lib/components/scaffold-eth";
  import { createAccount } from "@byteatatime/wagmi-svelte";
  import { BugAnt, Icon, MagnifyingGlass, DocumentCheck } from "svelte-hero-icons";

  const { address } = $derived.by(createAccount());
</script>

<div class="flex flex-grow flex-col items-center pt-10">
  <div class="px-5">
    <h1 class="text-center">
      <span class="mb-2 block text-2xl">Welcome to</span>
      <span class="block text-8xl font-bold">GunETH</span>
    </h1>
    <div class="flex items-center justify-center space-x-2">
      <p class="my-2 font-medium">Connected Address:</p>
      <Address {address} />
    </div>
  </div>

  <div class="bg-base-300 mt-16 w-full flex-grow px-8 py-12">
    <div class="flex flex-col items-center justify-center gap-12 sm:flex-row">
      <div class="bg-base-100 flex max-w-xs flex-col items-center rounded-3xl px-10 py-10 text-center">
        <svg class="mb-4 h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 0L9.5 8.5L12 10L14.5 8.5L12 0ZM12 11.5L9.5 10L12 24L14.5 10L12 11.5ZM12 10L14.5 8.5L12 0L9.5 8.5L12 10Z"
          />
        </svg>
        <p>
          Tinker with your smart contract using the
          <a href="/debug" class="link">Debug Contracts</a>
          tab.
        </p>
      </div>
      <div class="bg-base-100 flex max-w-xs flex-col items-center rounded-3xl px-10 py-10 text-center">
        <svg class="mb-4 h-20 w-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 417" fill="currentColor">
          <path d="M127.9 0L124.6 11.3V279.6L127.9 282.9L255.8 209.1L127.9 0Z" fill="#343434" />
          <path d="M127.9 0L0 209.1L127.9 282.9V154.2V0Z" fill="#8C8C8C" />
          <path d="M127.9 306.1L125.8 308.6V416.6L127.9 417.9L255.9 238.3L127.9 306.1Z" fill="#3C3C3B" />
          <path d="M127.9 417.9V306.1L0 238.3L127.9 417.9Z" fill="#8C8C8C" />
          <path d="M127.9 282.9L255.8 209.1L127.9 154.2V282.9Z" fill="#141414" />
          <path d="M0 209.1L127.9 282.9V154.2L0 209.1Z" fill="#393939" />
        </svg>
        <p>
          Explore your local transactions with the
          <a href="/blockexplorer" class="link">Block Explorer</a>
          tab.
        </p>
      </div>
    </div>
  </div>
</div>

<div class="card bg-base-100 mx-auto my-8 max-w-4xl p-6">
  <div class="card-body">
    <h2 class="card-title text-primary text-5xl font-extrabold">What is GunETH?</h2>
    <p class="text-base-content mt-4 text-lg font-semibold">
      GunETH is a cutting-edge decentralized application (dApp) built with Svelte and GunDB, seamlessly integrated with
      Ethereum for robust authentication and data encryption. This project aims to provide a fully decentralized
      platform where users can securely create, read, and update articles. By leveraging Ethereum signatures, GunETH
      ensures data integrity and privacy through advanced encryption techniques.
    </p>
    <h3 class="text-primary mt-6 text-4xl font-bold">Why GunETH?</h3>
    <ul class="text-base-content mt-4 list-inside list-disc text-lg font-semibold">
      <li>
        <span class="font-bold">Fully Decentralized:</span> GunETH is designed to be a completely decentralized application,
        eliminating the need for centralized servers and ensuring that users have full control over their data.
      </li>
      <li>
        <span class="font-bold">Efficient Data Storage:</span> By using GunDB, GunETH stores only the necessary data on the
        blockchain, optimizing storage costs and improving performance.
      </li>
      <li>
        <span class="font-bold">Ethereum-Based Encryption:</span> GunETH generates cryptographic pairs using Ethereum addresses,
        providing a secure and reliable method for data encryption and user authentication.
      </li>
    </ul>
    <h3 class="text-primary mt-6 text-4xl font-bold">Technology Stack</h3>
    <ul class="text-base-content mt-4 list-inside list-disc text-lg font-semibold">
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

<style>
</style>
