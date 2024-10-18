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
        <span class="mb-2 block text-2xl">Benvenuto in</span>
        <span class="block text-7xl font-semibold">Il Tuo Progetto</span>
        <img src={logo} class="mx-auto h-56 w-56" />
      </h1>
      <div class="flex items-center justify-center space-x-2">
        <p class="my-2 font-medium">Indirizzo Connesso:</p>
        <Address {address} />
      </div>
    </div>
  
    <div class="my-8 min-w-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 py-8 text-center text-white">
      <h2 class="mb-2 text-4xl font-bold">Live su Optimism Sepolia!</h2>
    </div>
  
    <div class="mt-16 w-full flex-grow px-8 py-12">
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
        <div class="flex max-w-xs flex-col items-center rounded-3xl px-10 py-10 text-center">
          <img src="https://scaffoldeth.io/logo.svg" alt="" class="h-auto w-auto" />
        </div>
      </div>
    </div>
  </div>
  
  <div class="card-actions mt-6 justify-center rounded-lg">
    <a
      href="https://github.com/tuo-utente/tuo-progetto"
      target="_blank"
      rel="noopener noreferrer"
      class="btn btn-primary btn-lg my-10 rounded-lg"
    >
      <Icon src={DocumentCheck} class="mr-2 h-6 w-6" />
      Fork il Repo
    </a>
  </div>
  
  <div class="card bg-ableton-light-blue mx-auto w-fit rounded-none text-black">
    <div class="bg-ableton-yellow flex w-full p-10 text-black">
      <div class="w-1/2 p-4">
        <h2 class="mb-4 text-5xl font-semibold">Origine del Progetto e Documentazione</h2>
        <p class="mb-4 text-xl">
          Il tuo progetto è basato su Scaffold-ETH, un framework per lo sviluppo rapido di applicazioni decentralizzate (dApp) su Ethereum.
        </p>
        <p class="mb-4 text-xl">
          Il progetto integra GunDB per la gestione decentralizzata dei dati e Wagmi per l'interazione con Ethereum.
        </p>
      </div>
      <div class="w-1/2 p-4">
        <h3 class="mb-4 text-3xl font-medium">Link Utili:</h3>
        <ul class="list-disc space-y-2 pl-5 text-xl">
          <li>
            <a href="https://scaffoldeth.io" class="hover:underline" target="_blank" rel="noopener noreferrer">
              Documentazione Scaffold-ETH
            </a>
          </li>
          <li>
            <a href="https://gun.eco/docs/" class="hover:underline" target="_blank" rel="noopener noreferrer">
              Documentazione GunDB
            </a>
          </li>
          <li>
            <a href="https://wagmi.sh/" class="hover:underline" target="_blank" rel="noopener noreferrer">
              Documentazione Wagmi
            </a>
          </li>
          <li>
            <a href="https://github.com/ByteAtATime/wagmi-svelte" class="hover:underline" target="_blank" rel="noopener noreferrer">
              Wagmi Svelte
            </a>
          </li>
          <li>
            <a href="https://github.com/tuo-utente/tuo-progetto" class="hover:underline" target="_blank" rel="noopener noreferrer">
              Repository GitHub del Tuo Progetto
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
  
  <style>
    /* Aggiungi qui il tuo stile personalizzato */
  </style>