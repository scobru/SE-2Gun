<script lang="ts">
</script>

<div class="mx-auto flex flex-grow flex-col text-left font-sans">
  <!-- Introduzione -->
  <div class="p-10">
    <h1 class="mb-4 text-4xl font-bold">SE-2Gun Documentation</h1>
    <p class="text-base-content mb-8 text-lg">
      A Svelte-friendly wrapper for GunDB, integrating Ethereum and Web3 functionality for decentralized database
      operations in Svelte applications.
    </p>
  </div>

  <!-- Caratteristiche principali -->
  <div class="bg-ableton-light-blue w-full p-10 text-black">
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

  <!-- Additional Information -->
  <div class="bg-ableton-orange w-full p-10 font-medium text-black">
    <section class="mb-12">
      <h2 class="mb-4 text-3xl font-semibold">Additional Information</h2>
      <p class="mb-4">
        SE-2Gun is based on Scaffold-ETH, a framework for rapid development of decentralized applications (dApps) on
        Ethereum.
      </p>
      <p class="mb-4">
        The project integrates GunDB for decentralized data management and Wagmi for Ethereum interaction.
      </p>
      <p class="mb-4">
        SE-2Gun utilizes gun-eth, a GunDB plugin for generating key pairs through Ethereum signatures.
        <a
          href="https://github.com/scobru/SE-2Gun/tree/main/packages/gun-eth"
          class="text-ableton-yellow hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about gun-eth
        </a>.
      </p>
      <p class="mb-4">
        For rapid testing of GunDB within the Scaffold-ETH environment, there's a dedicated extension available.
        <a
          href="https://github.com/scobru/SE-2Gun-extension"
          class="text-ableton-yellow hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check out the Scaffold-ETH GunDB extension
        </a>.
      </p>
      <h3 class="mb-2 text-2xl font-medium">Useful Links:</h3>
      <ul class="list-disc space-y-2 pl-5">
        <li>
          <a
            href="https://scaffoldeth.io"
            class="text-ableton-yellow hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Scaffold-ETH Documentation
          </a>
        </li>
        <li>
          <a
            href="https://gun.eco/docs/"
            class="text-ableton-yellow hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GunDB Documentation
          </a>
        </li>
        <li>
          <a
            href="https://wagmi.sh/"
            class="text-ableton-yellow hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wagmi Documentation
          </a>
        </li>
        <li>
          <a
            href="https://github.com/ByteAtATime/wagmi-svelte"
            class="text-ableton-yellow hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wagmi Svelte
          </a>
        </li>
        <li>
          <a
            href="https://github.com/scobru/se-2gun"
            class="text-ableton-yellow hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            SE-2Gun GitHub Repository
          </a>
        </li>
      </ul>
    </section>
  </div>

  <!-- Inizializzazione -->
  <div class="bg-ableton-yellow mx-auto w-full p-10 text-white">
    <section class="mb-12 ">
      <h2 class="mb-4 text-3xl font-semibold text-black">Getting Started</h2>
      <pre class="overflow-x-auto rounded-lg bg-gray-900 p-4"><code class="language-svelte">
<span class="text-blue-600">&lt;script&gt;</span>
  <span class="text-purple-600">import</span> <span class="text-orange-600">&#123; createAccount &#125;</span> <span
            class="text-purple-600">from</span
          > <span class="text-green-600">"@byteatatime/wagmi-svelte"</span>;

  <span class="text-blue-600">const</span> <span class="text-orange-600">gun</span> = <span class="text-yellow-600"
            >useGun()</span

          >; <span class="text-gray-600">// Initialize GunDB</span>
  <span class="text-blue-600">const</span> <span class="text-orange-600">&#123; user &#125;</span> = <span
            class="text-yellow-600">useUser()</span
          >; <span class="text-gray-600">// Initialize User</span>
  <span class="text-blue-600">const</span> <span class="text-orange-600"
            >&#123; address, chainId, status, isConnected &#125;</span
          > = <span class="text-yellow-600">$derived.by(createAccount())</span>; <span class="text-gray-600"
            >// Initialize Wagmi</span
          >
<span class="text-blue-600">&lt;/script&gt;</span>
      </code></pre>
    </section>
  </div>

  <!-- Autenticazione -->
  <div class="bg-ableton-green w-full p-10 text-white">
    <section class="mb-12">
      <h2 class="mb-4 text-3xl font-semibold text-black">Authentication</h2>
      <p class="mb-4 text-black">SE-2Gun provides Ethereum-based authentication:</p>
      <pre class="overflow-x-auto rounded-lg bg-gray-900 p-4"><code>
<span class="text-purple-600">import</span> <span class="text-orange-600">&#123; signIn, login, logout &#125;</span
          > <span class="text-purple-600">from</span> <span class="text-green-600">"$lib/gun/auth"</span>;

<span class="text-gray-500">// Registration</span>
<span class="text-blue-600">async function</span> <span class="text-yellow-600">handleSignIn</span>() &#123;
  <span class="text-blue-600">const</span> <span class="text-orange-600">result</span> = <span class="text-yellow-600"
            >await signIn()</span
          >;
  <span class="text-purple-600">if</span> (result) &#123;
    <span class="text-yellow-600">console.error</span>(result);
  &#125; <span class="text-purple-600">else</span> &#123;
    <span class="text-yellow-600">console.log</span>(<span class="text-green-600">"Registration successful"</span>);
  &#125;
&#125;

<span class="text-gray-500">// Login</span>
<span class="text-blue-600">async function</span> <span class="text-yellow-600">handleLogin</span>() &#123;
  <span class="text-blue-600">const</span> <span class="text-orange-600">result</span> = <span class="text-yellow-600"
            >await login()</span
          >;
  <span class="text-purple-600">if</span> (result) &#123;
    <span class="text-yellow-600">console.error</span>(result);
  &#125; <span class="text-purple-600">else</span> &#123;
    <span class="text-yellow-600">console.log</span>(<span class="text-green-600">"Login successful"</span>);
  &#125;
&#125;

<span class="text-gray-500">// Logout</span>
<span class="text-blue-600">function</span> <span class="text-yellow-600">handleLogout</span>() &#123;
  <span class="text-yellow-600">logout()</span>;
  <span class="text-yellow-600">console.log</span>(<span class="text-green-600">"Logged out"</span>);
&#125;
      </code></pre>
    </section>
  </div>

  <!-- Gestione del profilo utente -->
  <div class="bg-ableton-orange w-full p-10 text-white">
    <section class="mb-12">
      <h2 class="mb-4 text-3xl font-semibold text-black">User Profile Management</h2>
      <p class="mb-4 text-black">Manage user profiles with these functions:</p>
      <pre class="overflow-x-auto rounded-lg bg-gray-900 p-4"><code class="language-javascript">
<span class="text-purple-600">import</span> <span class="text-orange-600"
            >&#123; loadUserProfile, saveUserProfile, addProfileField &#125;</span
          > <span class="text-purple-600">from</span> <span class="text-green-600">'$lib/gun/user'</span>;

<span class="text-gray-500">// Load user profile</span>
<span class="text-blue-600">const</span> <span class="text-orange-600">profile</span> = <span class="text-yellow-600"
            >await loadUserProfile()</span
          >;

<span class="text-gray-500">// Save user profile</span>
<span class="text-yellow-600">await saveUserProfile(updatedProfile)</span>;

<span class="text-gray-500">// Add a new field to the profile</span>
<span class="text-yellow-600">addProfileField(</span><span class="text-green-600">'city'</span><span
            class="text-yellow-600">)</span
          >;
      </code></pre>
    </section>
  </div>

  <!-- SHINE -->
  <div class="bg-ableton-beige w-full p-10 text-white">
    <section class="mb-12">
      <h2 class="mb-4 text-3xl font-semibold t  text-black">SHINE (Secure Hash Integrity Network Ethereum)</h2>
      <p class="mb-4 text-black">Use SHINE for data verification on the blockchain:</p>
      <pre class="overflow-x-auto rounded-lg bg-gray-900 p-4"><code class="language-javascript">
<span class="text-blue-600">async function</span> <span class="text-yellow-600">saveMessage</span>() &#123;
  <span class="text-blue-600">const</span> <span class="text-orange-600">gunInstance</span> = <span
            class="text-yellow-600">useGun()</span
          >;
  <span class="text-blue-600">const</span> <span class="text-orange-600">result</span> = <span class="text-yellow-600"
            >await gunInstance.shine(</span
          ><span class="text-green-600">"optimismSepolia"</span>, message<span class="text-yellow-600">)</span>;
  <span class="text-purple-600">if</span> (result.ok) &#123;
    <span class="text-yellow-600">console.log</span>(<span class="text-green-600"
            >"Message saved and verified on blockchain"</span
          >);
    <span class="text-yellow-600">console.log</span>(<span class="text-green-600">"Node ID:"</span>, result.nodeId);
    <span class="text-yellow-600">console.log</span>(<span class="text-green-600">"Transaction Hash:"</span
          >, result.txHash);
  &#125; <span class="text-purple-600">else</span> &#123;
    <span class="text-yellow-600">console.error</span>(<span class="text-green-600">"Error saving message:"</span
          >, result.error);
  &#125;
&#125;

<span class="text-blue-600">async function</span> <span class="text-yellow-600">verifyMessage</span>(nodeId) &#123;
  <span class="text-blue-600">const</span> <span class="text-orange-600">gunInstance</span> = <span
            class="text-yellow-600">useGun()</span
          >;
  <span class="text-blue-600">const</span> <span class="text-orange-600">result</span> = <span class="text-yellow-600"
            >await gunInstance.shine(</span
          ><span class="text-green-600">"optimismSepolia"</span>, nodeId<span class="text-yellow-600">)</span>;
  <span class="text-purple-600">if</span> (result.ok) &#123;
    <span class="text-yellow-600">console.log</span>(<span class="text-green-600">"Message verified on blockchain"</span
          >);
    <span class="text-yellow-600">console.log</span>(<span class="text-green-600">"Timestamp:"</span
          >, result.timestamp);
    <span class="text-yellow-600">console.log</span>(<span class="text-green-600">"Updater:"</span>, result.updater);
    <span class="text-yellow-600">console.log</span>(<span class="text-green-600">"Latest Record:"</span
          >, result.latestRecord);
  &#125; <span class="text-purple-600">else</span> &#123;
    <span class="text-yellow-600">console.log</span>(<span class="text-green-600"
            >"Message not verified or not found"</span
          >);
  &#125;
&#125;
      </code></pre>
    </section>
  </div>

  <!-- Componenti -->
  <div class="bg-ableton-light-blue w-full p-10 text-white">
    <section class="mb-12">
      <h2 class="mb-4 text-3xl font-semibold text-black">Components</h2>

      <h3 class="mb-2 text-2xl font-medium text-black">AccountProfile.svelte</h3>
      <p class="mb-4 text-black">
        Displays account information including the public key, color, pulse, blink status, and last login.
      </p>
      <pre class="overflow-x-auto rounded-lg bg-gray-900 p-4"><code class="language-svelte">
<span class="text-purple-600">import</span> <span class="text-orange-600">AccountProfile</span> <span
            class="text-purple-600">from</span
          > <span class="text-green-600">"$lib/components/gun/account/AccountProfile.svelte"</span>;

&lt;<span class="text-blue-600">AccountProfile</span>  /&gt;
      </code></pre>

      <h3 class="mb-2 mt-6 text-2xl font-medium text-black">AccountAvatar.svelte</h3>
      <p class="mb-4 text-black">Shows the user's avatar with options to upload a new one if it's the current user's profile.</p>
      <pre class="overflow-x-auto rounded-lg bg-gray-900 p-4"><code class="language-svelte">
<span class="text-purple-600">import</span> <span class="text-orange-600">AccountAvatar</span> <span
            class="text-purple-600">from</span
          > <span class="text-green-600">"$lib/components/gun/account/AccountAvatar.svelte"</span>;

&lt;<span class="text-blue-600">AccountAvatar</span> <span class="text-yellow-600"><span class="text-yellow-600">size</span>=&#123;96&#125; <span
            class="text-yellow-600">border</span
          >=&#123;2&#125; /&gt;
      </code></pre>

      <h3 class="mb-2 mt-6 text-2xl font-medium text-black">ProfileDisplay.svelte</h3>
      <p class="mb-4 text-black">
        Allows viewing and editing user profile information with dynamic addition and removal of fields.
      </p>
      <pre class="overflow-x-auto rounded-lg bg-gray-900 p-4"><code class="language-svelte">
<span class="text-purple-600">import</span> <span class="text-orange-600">ProfileDisplay</span> <span
            class="text-purple-600">from</span
          > <span class="text-green-600">"$lib/components/gun/profile/ProfileDisplay.svelte"</span>;

&lt;<span class="text-blue-600">ProfileDisplay</span> /&gt;
      </code></pre>

      <h3 class="mb-2 mt-6 text-2xl font-medium text-black">Usage Example</h3>
      <p class="mb-4 text-black">Here's how you might use these components together on a user profile page:</p>
      <pre class="overflow-x-auto rounded-lg bg-gray-900 p-4"><code class="language-svelte">
&lt;<span class="text-purple-600">script</span>&gt;
<span class="text-purple-600">import</span> &#123; <span class="text-orange-600">useUser</span> &#125; <span
            class="text-purple-600">from</span
          > <span class="text-green-600">'$lib/gun/user'</span>;
<span class="text-purple-600">import</span> <span class="text-orange-600">AccountProfile</span> <span
            class="text-purple-600">from</span
          > <span class="text-green-600">"$lib/components/gun/account/AccountProfile.svelte"</span>;
<span class="text-purple-600">import</span> <span class="text-orange-600">AccountAvatar</span> <span
            class="text-purple-600">from</span
          > <span class="text-green-600">"$lib/components/gun/account/AccountAvatar.svelte"</span>;
<span class="text-purple-600">import</span> <span class="text-orange-600">ProfileDisplay</span> <span
            class="text-purple-600">from</span
          > <span class="text-green-600">"$lib/components/gun/profile/ProfileDisplay.svelte"</span>;

<span class="text-blue-600">const</span> &#123; <span class="text-orange-600">user</span> &#125; = <span
            class="text-yellow-600">useUser()</span
          >;
&lt;/<span class="text-purple-600">script</span>&gt;

&lt;<span class="text-blue-600">div</span> <span class="text-yellow-600">class</span>=<span class="text-green-600"
            >"flex flex-col md:flex-row gap-4"</span
          >&gt;
  &lt;<span class="text-blue-600">div</span> <span class="text-yellow-600">class</span>=<span class="text-green-600"
            >"w-full md:w-1/3"</span
          >&gt;
    &lt;<span class="text-blue-600 text-black">AccountAvatar</span> <span class="text-yellow-600">pub</span
          >=&#123;$user.pub&#125; <span class="text-yellow-600">size</span>=&#123;128&#125; /&gt;
    &lt;<span class="text-blue-600 text-black">AccountProfile</span> <span class="text-yellow-600">pub</span
          >=&#123;$user.pub&#125; /&gt;
  &lt;/<span class="text-blue-600">div</span>&gt;
  &lt;<span class="text-blue-600">div</span> <span class="text-yellow-600">class</span>=<span class="text-green-600"
            >"w-full md:w-2/3"</span
          >&gt;
    &lt;<span class="text-blue-600 text-black">ProfileDisplay</span> /&gt;
  &lt;/<span class="text-blue-600">div</span>&gt;
&lt;/<span class="text-blue-600">div</span>&gt;
      </code></pre>
    </section>
  </div>

  <!-- Funzioni aggiuntive -->
  <div class="bg-ableton-green w-full p-10 text-white">
    <section class="mb-12">
      <h2 class="mb-4 text-3xl font-semibold text-black">Additional Functions</h2>

      <h3 class="mb-2 text-2xl font-medium text-black">User Functions</h3>
      <ul class="list-disc space-y-2 pl-5 text-black  ">
        <li><strong>selectedUser:</strong> A writable store that holds the currently selected user's public key.</li>
        <li><strong>userPub:</strong> A derived store that always contains the current user's public key.</li>
        <li>
          <strong>pair():</strong> Returns the current user's SEA key pair. Use with caution as it logs each access.
        </li>
        <li><strong>init():</strong> Initializes the user's data and sets up listeners for updates.</li>
        <li><strong>isMine(soul: string):</strong> Checks if the given soul belongs to the current user.</li>
        <li><strong>loadUserProfile():</strong> Loads the user's profile from Gun and updates the local store.</li>
        <li>
          <strong>addProfileField(title: string, initialValue: string = ""):</strong> Adds a new field to the user's profile
          if it doesn't already exist.
        </li>
        <li>
          <strong>updateProfileField(field: string, value: string):</strong> Updates a specific field in the user's profile.
        </li>
        <li><strong>removeProfileField(field: string):</strong> Removes a field from the user's profile.</li>
        <li>
          <strong>saveUserProfile(profile: Object):</strong> Saves the entire user profile, updating both Gun and the local
          store.
        </li>
      </ul>
      <h3 class="mb-2 mt-6 text-2xl font-medium text-black">Account Functions</h3>
      <ul class="list-disc space-y-2 pl-5 text-black">
        <li>
          <strong>useAccount(pubKey: string):</strong> Sets up and manages an account for the given public key, including
          profile data and online status.
        </li>
        <li>
          <strong>setPetname(pub: string, name: string):</strong> Sets a petname (nickname) for a user, encrypting it before
          storage.
        </li>
        <li>
          <strong>useAvatar(pub: string, size: number):</strong> Manages the avatar for a user, including retrieval and upload
          functionality.
        </li>
      </ul>
    </section>
  </div>
  

  <!-- Conclusione -->
  <div class="w-full p-10">
    <p class="bg-ableton-blue rounded-lg bg-opacity-20 p-4 text-lg font-medium">
      These components and functions work together to provide a comprehensive user profile management system,
      integrating GunDB, Ethereum authentication, and blockchain verification for decentralized applications.
    </p>
  </div>
</div>
