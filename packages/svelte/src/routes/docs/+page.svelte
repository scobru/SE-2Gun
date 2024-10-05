<script>
  // Import any necessary components or functions

  let activeSection = "gun-eth";

  function setActiveSection(section) {
    activeSection = section;
  }

  const verifyDataExample = `
const nodeId = "your-node-id-here";
gun.shine("optimismSepolia", nodeId, null, (ack) => {
  if (ack.ok) {
    console.log("Data verified on blockchain", ack);
    console.log("Timestamp:", ack.timestamp);
    console.log("Updater:", ack.updater);
    console.log("Latest Record:", ack.latestRecord);
  } else {
    console.log("Data not verified or not found", ack);
  }
});
  `;

  const storeDataExample = `
const data = { message: "Hello, blockchain!" };
gun.shine("optimismSepolia", null, data, (ack) => {
  if (ack.ok) {
    console.log("Data stored on Gun.js and blockchain", ack);
    console.log("New Node ID:", ack.nodeId);
    console.log("Transaction Hash:", ack.txHash);
  } else {
    console.log("Error storing data", ack);
  }
});
  `;
</script>

<main class="container mx-auto flex p-4">
  <aside class="w-64 pr-8">
    <nav class="sticky top-4">
      <ul class="space-y-2">
        <li>
          <a
            href="#gun-eth"
            class="block rounded p-2 {activeSection === 'gun-eth' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}"
            on:click={() => setActiveSection("gun-eth")}
          >
            GUN-ETH
          </a>
        </li>
        <li>
          <a
            href="#authentication"
            class="block rounded p-2 {activeSection === 'authentication'
              ? 'bg-blue-500 text-white'
              : 'hover:bg-blue-100'}"
            on:click={() => setActiveSection("authentication")}
          >
            AUTH
          </a>
        </li>
        <li>
          <a
            href="#shine"
            class="block rounded p-2 {activeSection === 'shine' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}"
            on:click={() => setActiveSection("shine")}
          >
            SHINE
          </a>
        </li>
        <li>
          <a
            href="#inspector"
            class="block rounded p-2 {activeSection === 'inspector' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}"
            on:click={() => setActiveSection("inspector")}
          >
            INSPECTOR
          </a>
        </li>
        <li>
          <a
            href="#gungraph"
            class="block rounded p-2 {activeSection === 'gungraph' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}"
            on:click={() => setActiveSection("gungraph")}
          >
            GUNGRA.PH
          </a>
        </li>
      </ul>
    </nav>
  </aside>
  <div class="flex-1">
    <h1 class="mb-6 text-3xl font-bold">Documentation</h1>

    <section id="gun-eth" class="mb-12">
      <h2 class="mb-4 text-2xl font-semibold capitalize">GUN-ETH PLUGIN</h2>
      <p class="mb-4">
        The Gun-eth plugin extends Gun.js functionality to integrate seamlessly with Ethereum blockchain capabilities.
        It provides a suite of tools for working with Ethereum signatures, managing encrypted key pairs, and
        implementing the SHINE for blockchain data verification.
      </p>

      <h3 class="mb-2 text-xl font-semibold">Key Features:</h3>
      <ul class="mt-4 list-disc pl-6">
        <li><strong>Ethereum Signature Verification:</strong> Verify Ethereum signatures for messages.</li>
        <li><strong>Password Generation:</strong> Generate secure passwords from Ethereum signatures.</li>
        <li><strong>Signature Creation:</strong> Create Ethereum signatures for messages.</li>
        <li><strong>Encrypted Key Pair Management:</strong> Create, store, and retrieve encrypted key pairs.</li>
        <li>
          <strong>SHINE Implementation:</strong> Implement the SHINE for data verification on the blockchain.
        </li>
      </ul>

      <h3 class="mb-2 mt-4 text-xl font-semibold">Core Functions:</h3>
      <ul class="list-disc pl-6">
        <li>
          <code>verifySignature(message, signature)</code>: Verifies an Ethereum signature for a given message.
          <pre class="mt-2 rounded bg-gray-400 p-2"><code
              >const recoveredAddress = await gun.verifySignature(message, signature);</code
            ></pre>
        </li>
        <li>
          <code>generatePassword(signature)</code>: Generates a password from an Ethereum signature.
          <pre class="mt-2 rounded bg-gray-400 p-2"><code>const password = gun.generatePassword(signature);</code></pre>
        </li>
        <li>
          <code>createSignature(message)</code>: Creates an Ethereum signature for a message.
          <pre class="mt-2 rounded bg-gray-400 p-2"><code>const signature = await gun.createSignature(message);</code
            ></pre>
        </li>
        <li>
          <code>createAndStoreEncryptedPair(address, signature)</code>: Creates and stores an encrypted key pair.
          <pre class="mt-2 rounded bg-gray-400 p-2"><code
              >await gun.createAndStoreEncryptedPair(address, signature);</code
            ></pre>
        </li>
        <li>
          <code>getAndDecryptPair(address, signature)</code>: Retrieves and decrypts a stored key pair.
          <pre class="mt-2 rounded bg-gray-400 p-2"><code
              >const decryptedPair = await gun.getAndDecryptPair(address, signature);</code
            ></pre>
        </li>
        <li>
          <code>shine(chain, nodeId, data, callback)</code>: Implements the SHINE for data verification and storage on
          the blockchain.
          <pre class="mt-2 rounded bg-gray-400 p-2"><code>gun.shine("optimismSepolia", nodeId, data, callback);</code
            ></pre>
        </li>
      </ul>

      <h3 class="mb-2 mt-4 text-xl font-semibold">SHINE:</h3>
      <p class="mb-4">
        The SHINE (Secure Hash Integrity Network Ethereum) provides a mechanism for verifying data integrity using
        Ethereum and Gun.js. Here's how it works:
      </p>
      <ol class="list-decimal pl-6">
        <li>
          <strong>Data Storage:</strong> When saving data, a content hash is generated and stored both in Gun.js and on the
          Ethereum blockchain.
        </li>
        <li>
          <strong>Data Verification:</strong> To verify data, the stored hash is compared with a hash generated from the
          data retrieved from Gun.js.
        </li>
        <li>
          <strong>Blockchain Interaction:</strong> The plugin interacts with an Ethereum smart contract to store and verify
          data hashes.
        </li>
      </ol>

      <h3 class="mb-2 mt-4 text-xl font-semibold">Usage Examples:</h3>

      <h4 class="mb-1 mt-2 text-lg font-semibold">Verifying Data by NodeId:</h4>
      <pre class="mt-2 overflow-x-auto rounded bg-gray-400 p-2">
        <code>{verifyDataExample}</code>
      </pre>

      <h4 class="mb-1 mt-2 text-lg font-semibold">Storing New Data:</h4>
      <pre class="mt-2 overflow-x-auto rounded bg-gray-400 p-2">
        <code>{storeDataExample}</code>
      </pre>

      <p class="mt-2">
        Note: When verifying data, you pass the nodeId and set data to null. When storing new data, you pass the data
        object and set nodeId to null.
      </p>

      <h3 class="mb-2 mt-4 text-xl font-semibold">Security Considerations:</h3>
      <ul class="list-disc pl-6">
        <li>
          Ensure you're using a secure Ethereum provider (e.g., MetaMask) when interacting with functions that require
          signatures.
        </li>
        <li>Generated passwords and key pairs are sensitive. Handle them with care and avoid exposing them.</li>
        <li>The plugin relies on the security of both Gun.js and Ethereum. Keep both dependencies up to date.</li>
        <li>Be aware of the gas costs associated with blockchain interactions when using the SHINE .</li>
      </ul>
    </section>

    <section id="authentication" class="mb-12">
      <h2 class="mb-4 text-2xl font-semibold">AUTHENTICATION</h2>
      <p>
        The authentication process in SHINE combines Ethereum signatures with Gun.js for secure and decentralized user
        management:
      </p>
      <ol class="mt-4 list-decimal pl-6">
        <li>
          <strong>Signature:</strong> User signs a message with their Ethereum wallet, proving ownership of the address.
        </li>
        <li>
          <strong>Encrypted Identity:</strong> The signature is used to generate and encrypt a unique identity for the user.
        </li>
        <li>
          <strong>Gun Registration:</strong> This encrypted identity is then registered and stored in Gun.js, creating a
          decentralized user account.
        </li>
      </ol>
      <p class="mt-4">
        This process ensures secure, pseudonymous authentication without relying on centralized servers or exposing
        sensitive information.
      </p>
    </section>

    <section id="shine" class="mb-12">
      <h2 class="mb-4 text-2xl font-semibold">SHINE (Secure Hash Integrity Network Ethereum)</h2>
      <p>SHINE provides a mechanism for verifying data integrity using Ethereum and Gun.js:</p>
      <ol class="mt-4 list-decimal pl-6">
        <li><strong>Data Hashing:</strong> User data is hashed to create a unique fingerprint.</li>
        <li>
          <strong>Blockchain Storage:</strong> The hash is stored on the Ethereum blockchain, creating an immutable record.
        </li>
        <li>
          <strong>Decentralized Data Storage:</strong> The original data is stored in Gun.js, ensuring decentralized access.
        </li>
        <li>
          <strong>Verification:</strong> Data integrity can be verified by comparing the stored hash with a newly generated
          hash of the retrieved data.
        </li>
      </ol>
      <p class="mt-4">
        This system allows for trustless verification of data integrity, combining the security of blockchain with the
        flexibility of decentralized storage.
      </p>
    </section>

    <section id="inspector" class="mb-12">
      <h2 class="mb-4 text-2xl font-semibold">INSPECTOR</h2>
      <p>The Inspector component provides a powerful tool for exploring and manipulating Gun.js data:</p>
      <ul class="mt-4 list-disc pl-6">
        <li><strong>Data Visualization:</strong> View the structure and content of Gun.js data in real-time.</li>
        <li><strong>Node Navigation:</strong> Easily navigate through the graph structure of Gun.js data.</li>
        <li><strong>Data Manipulation:</strong> Add, edit, or delete nodes directly from the interface.</li>
        <li><strong>Search Functionality:</strong> Quickly find specific nodes or data within the Gun.js graph.</li>
        <li><strong>Real-time Updates:</strong> See changes to the data reflected immediately in the interface.</li>
      </ul>
      <p class="mt-4">
        The Inspector is an essential tool for developers working with Gun.js, providing insights into data structure
        and facilitating debugging and data management tasks.
      </p>
    </section>

    <section id="gungraph" class="mb-12">
      <h2 class="mb-4 text-2xl font-semibold">GUNGRAPH</h2>
      <p>GunGraph is a component that demonstrates the power of decentralized social networking using Gun.js:</p>
      <ul class="mt-4 list-disc pl-6">
        <li><strong>Post Creation:</strong> Users can create and publish posts to the decentralized network.</li>
        <li><strong>Data Persistence:</strong> Posts are stored in Gun.js, ensuring data availability across peers.</li>
        <li>
          <strong>Real-time Updates:</strong> New posts and changes are reflected in real-time across all connected clients.
        </li>
        <li><strong>User Ownership:</strong> Each user has control over their own data and can manage their posts.</li>
        <li>
          <strong>Decentralized Architecture:</strong> The system operates without a central server, leveraging peer-to-peer
          connections.
        </li>
      </ul>
      <p class="mt-4">
        GunGraph showcases how Gun.js can be used to build decentralized applications with real-time data
        synchronization, providing a foundation for creating resilient and user-centric social platforms.
      </p>
    </section>
  </div>

  <!-- Additional sections as needed -->
</main>
