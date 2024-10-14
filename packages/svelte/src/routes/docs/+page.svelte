<script lang="ts">
  // Importazioni necessarie
  import { useGun } from '$lib/gun/gun';
  import { useUser } from '$lib/gun/user';
  import { createAccount } from "@byteatatime/wagmi-svelte";
</script>

<main class="container ">
  <div class="  p-10 w-screen">
    <h1 class="mb-4 text-4xl font-bold">SE-2Gun Documentation</h1>
    <p class="text-base-content mb-8 text-lg">
      A Svelte-friendly wrapper for GunDB, integrating Ethereum and Web3 functionality for decentralized database
      operations in Svelte applications.
    </p>
  </div>

  <div class="bg-ableton-light-blue text-black p-10 w-screen">
    <section class="mb-12">
      <h2 class="mb-4 text-3xl font-semibold">Key Features</h2>
      <ul class="list-disc space-y-2 pl-5">
        <li>Seamless integration of GunDB with Svelte applications</li>
        <li>Ethereum-based authentication and encryption</li>
        <li>User profile management</li>
        <li>SHINE (Secure Hash Integrity Network Ethereum) for data verification on the blockchain</li>
        <li>Wagmi-Svelte integration for easy Web3 development</li>
      </ul>
    </section>
  </div>

  <div class="bg-ableton-yellow text-black p-10 w-screen">
    <section class="mb-12">
      <h2 class="mb-4 text-3xl font-semibold">Getting Started</h2>
      <p class="mb-4">First, install the library:</p>
      <pre class="bg-white overflow-x-auto rounded-lg p-4"><code>$ pnpm add @your-org/se-2gun</code></pre>
      <p class="my-4">Then, you can start using SE-2Gun in your Svelte components:</p>
      <pre class="bg-white overflow-x-auto rounded-lg p-4"><code>
&lt;script&gt;
  import &#123; useGun, useUser &#125; from '@your-org/se-2gun';
  import &#123; createAccount &#125; from "@byteatatime/wagmi-svelte";

  const gun = useGun();
  const &#123; user &#125; = useUser();
  const &#123; address, chainId, status, isConnected &#125; = $derived.by(createAccount());
&lt;/script&gt;
      </code></pre>
    </section>
  </div>

  <div class="bg-ableton-green text-black p-10 w-screen">
    <section class="mb-12">
      <h2 class="mb-4 text-3xl font-semibold">Authentication</h2>
      <p class="mb-4">SE-2Gun provides Ethereum-based authentication:</p>
      <pre class="bg-white overflow-x-auto rounded-lg p-4"><code>
import &#123; signIn, login, logout &#125; from "$lib/gun/auth";

// Registration
async function handleSignIn() &#123;
  const result = await signIn();
  if (result) &#123;
    console.error(result);
  &#125; else &#123;
    console.log("Registration successful");
  &#125;
&#125;

// Login
async function handleLogin() &#123;
  const result = await login();
  if (result) &#123;
    console.error(result);
  &#125; else &#123;
    console.log("Login successful");
  &#125;
&#125;

// Logout
function handleLogout() &#123;
  logout();
  console.log("Logged out");
&#125;
      </code></pre>
    </section>
  </div>

  <div class="bg-ableton-orange text-black p-10 w-screen">
    <section class="mb-12">
      <h2 class="mb-4 text-3xl font-semibold">User Profile Management</h2>
      <p class="mb-4">Manage user profiles with these functions:</p>
      <pre class="bg-white overflow-x-auto rounded-lg p-4"><code>
import &#123; loadUserProfile, saveUserProfile, addProfileField &#125; from '$lib/gun/user';

// Load user profile
const profile = await loadUserProfile();

// Save user profile
await saveUserProfile(updatedProfile);

// Add a new field to the profile
addProfileField('city');
      </code></pre>
    </section>
  </div>

  <div class="bg-ableton-beige text-black p-10 w-screen">
    <section class="mb-12">
      <h2 class="mb-4 text-3xl font-semibold">SHINE (Secure Hash Integrity Network Ethereum)</h2>
      <p class="mb-4">Use SHINE for data verification on the blockchain:</p>
      <pre class="bg-white overflow-x-auto rounded-lg p-4"><code>
async function saveMessage() &#123;
  const gunInstance = useGun();
  const result = await gunInstance.shine("optimismSepolia", message);
  if (result.ok) &#123;
    console.log("Message saved and verified on blockchain");
    console.log("Node ID:", result.nodeId);
    console.log("Transaction Hash:", result.txHash);
  &#125; else &#123;
    console.error("Error saving message:", result.error);
  &#125;
&#125;

async function verifyMessage(nodeId) &#123;
  const gunInstance = useGun();
  const result = await gunInstance.shine("optimismSepolia", nodeId);
  if (result.ok) &#123;
    console.log("Message verified on blockchain");
    console.log("Timestamp:", result.timestamp);
    console.log("Updater:", result.updater);
    console.log("Latest Record:", result.latestRecord);
  &#125; else &#123;
    console.log("Message not verified or not found");
  &#125;
&#125;
      </code></pre>
    </section>
  </div>

  <div class="bg-ableton-light-blue text-black p-10 w-screen">
    <section class="mb-12">
      <h2 class="mb-4 text-3xl font-semibold">Components</h2>
      
      <h3 class="mb-2 text-2xl font-medium">AccountProfile.svelte</h3>
      <p class="mb-4">Displays account information including public key, color, pulse, blink status, and last seen time.</p>
      <pre class="bg-white overflow-x-auto rounded-lg p-4"><code>
import AccountProfile from "$lib/components/gun/account/AccountProfile.svelte";

&lt;AccountProfile pub=&#123;userPublicKey&#125; /&gt;
      </code></pre>

      <h3 class="mb-2 mt-6 text-2xl font-medium">AccountAvatar.svelte</h3>
      <p class="mb-4">Displays the user's avatar with options to upload a new one if it's the current user's profile.</p>
      <pre class="bg-white overflow-x-auto rounded-lg p-4"><code>
import AccountAvatar from "$lib/components/gun/account/AccountAvatar.svelte";

&lt;AccountAvatar pub=&#123;userPublicKey&#125; size=&#123;96&#125; border=&#123;2&#125; /&gt;
      </code></pre>

      <h3 class="mb-2 mt-6 text-2xl font-medium">ProfileDisplay.svelte</h3>
      <p class="mb-4">Allows viewing and editing of user profile information with dynamic field addition and removal.</p>
      <pre class="bg-white overflow-x-auto rounded-lg p-4"><code>
import ProfileDisplay from "$lib/components/gun/profile/ProfileDisplay.svelte";

&lt;ProfileDisplay /&gt;
      </code></pre>

      <h3 class="mb-2 mt-6 text-2xl font-medium">Usage Example</h3>
      <p class="mb-4">Here's how you might use these components together in a user profile page:</p>
      <pre class="bg-white overflow-x-auto rounded-lg p-4"><code>
&lt;script&gt;
import &#123; useUser &#125; from '$lib/gun/user';
import AccountProfile from "$lib/components/gun/account/AccountProfile.svelte";
import AccountAvatar from "$lib/components/gun/account/AccountAvatar.svelte";
import ProfileDisplay from "$lib/components/gun/profile/ProfileDisplay.svelte";

const &#123; user &#125; = useUser();
&lt;/script&gt;

&lt;div class="flex flex-col md:flex-row gap-4"&gt;
  &lt;div class="w-full md:w-1/3"&gt;
    &lt;AccountAvatar pub=&#123;$user.pub&#125; size=&#123;128&#125; /&gt;
    &lt;AccountProfile pub=&#123;$user.pub&#125; /&gt;
  &lt;/div&gt;
  &lt;div class="w-full md:w-2/3"&gt;
    &lt;ProfileDisplay /&gt;
  &lt;/div&gt;
&lt;/div&gt;
      </code></pre>
    </section>
  </div>

  <div class=" p-10 w-screen  ">
    <p class="bg-ableton-blue bg-opacity-20 rounded-lg p-4 text-lg font-medium">
      These components work together to provide a comprehensive user profile management system. The AccountProfile shows account-specific information, AccountAvatar handles the user's profile picture, and ProfileDisplay allows for dynamic profile field management.
    </p>
  </div>
</main>