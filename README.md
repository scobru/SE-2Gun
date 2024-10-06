# 🏗️ ScafoldETH2-Gun 🔫 - SE2-Gun

## Table of Contents

- [SE2-Gun-Extension](#se2-gun-extension)
- [GUN-ETH Plugin](#gun-eth-plugin)
  - [Key Features](#key-features)
  - [Core Functions](#core-functions)
  - [SHINE](#shine)
  - [Usage Examples](#usage-examples)
  - [Security Considerations](#security-considerations)
- [Authentication](#authentication)
- [SHINE](#shine-secure-hash-integrity-network-ethereum)
- [Inspector](#inspector)
- [Gungra.ph](#gungraph)

## SE2-Gun-Extension

The SE2-Gun-Extension is a plugin for SE2 that provides a ready to go installation of Gun and the Gun-Eth plugin.

[SE2-Gun-Extension](https://github.com/scobru/se2-gun-extension)

### How to install

```bash
npx create-eth@latest -e {scobru/se2-gun-extension}
```

## GUN-ETH Plugin

The Gun-eth plugin extends Gun.js functionality to integrate seamlessly with Ethereum blockchain capabilities. It provides a suite of tools for working with Ethereum signatures, managing encrypted key pairs, and implementing the SHINE for blockchain data verification.

### Key Features

- **Ethereum Signature Verification**: Verify Ethereum signatures for messages.
- **Password Generation**: Generate secure passwords from Ethereum signatures.
- **Signature Creation**: Create Ethereum signatures for messages.
- **Encrypted Key Pair Management**: Create, store, and retrieve encrypted key pairs.
- **SHINE Implementation**: Implement the SHINE for data verification on the blockchain.

### How to install

```bash
npm install gun-eth
```

```bash
import gun from "gun";
import "gun-eth";

const gun = gun();

await gun.generatePassword("YOUR_SIGNATURE");
```

### How to use

Learn more about Gun.js [here](https://gun.eco/docs/Getting-Started).

Learn more about plugin implementation [here](https://github.com/amark/gun/wiki/Adding-Methods-to-the-Gun-Chain#abstraction-layers).

### Core Functions

- `verifySignature(message, signature)`: Verifies an Ethereum signature for a given message.

  ```js
  const recoveredAddress = await gun.verifySignature(message, signature);
  ```

- `generatePassword(signature)`: Generates a password from an Ethereum signature.

  ```js
  const password = gun.generatePassword(signature);
  ```

- `createSignature(message)`: Creates an Ethereum signature for a message.

  ```js
  const signature = await gun.createSignature(message);
  ```

- `createAndStoreEncryptedPair(address, signature)`: Creates and stores an encrypted key pair.

  ```js
  await gun.createAndStoreEncryptedPair(address, signature);
  ```

- `getAndDecryptPair(address, signature)`: Retrieves and decrypts a stored key pair.

  ```js
  const decryptedPair = await gun.getAndDecryptPair(address, signature);
  ```

- `shine(chain, nodeId, data, callback)`: Implements SHINE for data verification and storage on the blockchain.
  ```js
  gun.shine("optimismSepolia", nodeId, data, callback);
  ```

### SHINE

SHINE (Secure Hash Integrity Network Ethereum) provides a mechanism for verifying data integrity using Ethereum and Gun.js.

1. **Data Storage**: When saving data, a content hash is generated and stored in both Gun.js and on the Ethereum blockchain.
2. **Data Verification**: To verify data, the stored hash is compared with a hash generated from the data retrieved from Gun.js.
3. **Blockchain Interaction**: The plugin interacts with an Ethereum smart contract to store and verify data hashes.

### Usage Examples

#### Verifying Data by NodeId

```js
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
```

#### Storing New Data

```js
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
```

### Security Considerations

- Use a secure Ethereum provider (e.g., MetaMask) when interacting with functions that require signatures.
- Generated passwords and key pairs are sensitive. Handle them carefully and avoid exposing them.
- Keep Gun.js and Ethereum dependencies up to date for security.
- Be aware of gas costs associated with blockchain interactions when using SHINE.

## Authentication

The authentication process in SHINE combines Ethereum signatures with Gun.js for secure and decentralized user management:

1. **Signature**: The user signs a message with their Ethereum wallet, proving ownership of the address.
2. **Encrypted Identity**: The signature is used to generate and encrypt a unique identity for the user.
3. **Gun Registration**: This encrypted identity is then registered and stored in Gun.js, creating a decentralized user account.

This process ensures secure, pseudonymous authentication without relying on centralized servers or exposing sensitive information.

## SHINE (Secure Hash Integrity Network Ethereum)

SHINE provides a mechanism for verifying data integrity using Ethereum and Gun.js:

1. **Data Hashing**: User data is hashed to create a unique fingerprint.
2. **Blockchain Storage**: The hash is stored on the Ethereum blockchain, creating an immutable record.
3. **Decentralized Data Storage**: The original data is stored in Gun.js, ensuring decentralized access.
4. **Verification**: Data integrity can be verified by comparing the stored hash with a newly generated hash of the retrieved data.

This system allows for trustless verification of data integrity, combining the security of blockchain with the flexibility of decentralized storage.

## Inspector

The Inspector component provides a powerful tool for exploring and manipulating Gun.js data:

- **Data Visualization**: View the structure and content of Gun.js data in real-time.
- **Node Navigation**: Easily navigate through the graph structure of Gun.js data.
- **Data Manipulation**: Add, edit, or delete nodes directly from the interface.
- **Search Functionality**: Quickly find specific nodes or data within the Gun.js graph.
- **Real-time Updates**: See changes to the data reflected immediately in the interface.

The Inspector is an essential tool for developers working with Gun.js, providing insights into data structure and facilitating debugging and data management tasks.

## Gungra.ph

GunGraph demonstrates the power of decentralized social networking using Gun.js:

- **Post Creation**: Users can create and publish posts to the decentralized network.
- **Data Persistence**: Posts are stored in Gun.js, ensuring data availability across peers.
- **Real-time Updates**: New posts and changes are reflected in real-time across all connected clients.
- **User Ownership**: Each user controls their own data and can manage their posts.
- **Decentralized Architecture**: The system operates without a central server, leveraging peer-to-peer connections.

GunGraph showcases how Gun.js can be used to build decentralized applications with real-time data synchronization, providing a foundation for creating resilient and user-centric social platforms.
