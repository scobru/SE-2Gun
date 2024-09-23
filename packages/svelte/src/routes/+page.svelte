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
      <span class="block text-8xl font-bold">Gun-ETH</span>
    </h1>
    <div class="flex items-center justify-center space-x-2">
      <p class="my-2 font-medium">Connected Address:</p>
      <Address {address} />
    </div>
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
        <img
          src="https://imgs.search.brave.com/NGX8HX5KFugNT0f1h-bEFpaI-b5n0oFXxlZiRyGjPyc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdHls/ZXMucmVkZGl0bWVk/aWEuY29tL3Q1XzJ6/ZjltL3N0eWxlcy9j/b21tdW5pdHlJY29u/X2hlYmNrYmQ2NHc4/MTEucG5n"
          alt=""
          class="h-auto w-auto"
        />
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
      platform where users can create unique pair and store into GunDB. By leveraging Ethereum signatures, GunETH
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
