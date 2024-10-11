# GUN-ETH

<img src="https://imgs.search.brave.com/RM76D4wyToxCzGffJLw33O_L3glhpIVS3KLvXehpMt8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dXNlcmxvZ29zLm9y/Zy9maWxlcy9sb2dv/cy9mZXJuYW5kb3Nh/bnR1Y2NpLzI5NDY5/X2d1bmRiLWxvZ28u/cG5n" alt="gun" width="200"/>
<img src="https://imgs.search.brave.com/kQyriTMPqw42DEhIQj3eEKIcLZu_C4nNIVR8KtAn3lo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bG9nby53aW5lL2Ev/bG9nby9FdGhlcmV1/bS9FdGhlcmV1bS1E/aWFtb25kLUxvZ28u/d2luZS5zdmc" alt="eth" width="200"/>

## Table of Contents

1. [Description](#description)
2. [Smart Contract](#smart-contract)
3. [Key Features](#key-features)
4. [How to Install](#how-to-install)
5. [How to Use](#how-to-use)
6. [Core Functions](#core-functions)
7. [SHINE](#shine)
8. [Standalone Mode](#standalone-mode)
9. [Security Considerations](#security-considerations)
10. [Contributing](#contributing)
11. [License](#license)
12. [Contact](#contact)

## DESCRIPTION

Gun-eth is a plugin for GunDB that integrates Ethereum and Web3 functionality. This plugin extends GunDB's capabilities by allowing interaction with the Ethereum blockchain and providing cryptographic and signature management features.

## SMART CONTRACT

SHINE Smart Contract deployed on Optimism Sepolia: [0x43D838b683F772F08f321E5FA265ad3e333BE9C2](https://sepolia-optimism.etherscan.io/address/0x43D838b683F772F08f321E5FA265ad3e333BE9C2)

Currently, the contract is deployed only on Optimism Sepolia. In the future, it will be deployed on multiple chains.

## No time? Check the [TUTORIAL](./TUTORIAL.md)

## KEY FEATURES

- **Ethereum Signature Verification**: Verify Ethereum signatures for messages.
- **Password Generation**: Generate secure passwords from Ethereum signatures.
- **Signature Creation**: Create Ethereum signatures for messages.
- **Encrypted Key Pair Management**: Create, store, and retrieve encrypted key pairs.
- **SHINE Implementation**: Implement the SHINE for data verification on the blockchain.
- **Custom Token Management**: Set and retrieve custom tokens for Gun operations.

## HOW TO INSTALL

```bash
npm install gun-eth
```

```javascript
import gun from "gun";
import "gun-eth";

const gun = Gun();

await gun.generatePassword("YOUR_SIGNATURE");
```

## HOW TO USE

Learn more about Gun.js [here](https://gun.eco/docs/Getting-Started).

Learn more about plugin implementation [here](https://github.com/amark/gun/wiki/Adding-Methods-to-the-Gun-Chain#abstraction-layers).

## CORE FUNCTIONS

- `verifySignature(message, signature)`: Verifies an Ethereum signature for a given message.

  ```javascript
  const recoveredAddress = await gun.verifySignature(message, signature);
  ```

- `generatePassword(signature)`: Generates a password from an Ethereum signature.

  ```javascript
  const password = gun.generatePassword(signature);
  ```

- `createSignature(message)`: Creates an Ethereum signature for a message.

  ```javascript
  const signature = await gun.createSignature(message);
  ```

- `createAndStoreEncryptedPair(address, signature)`: Creates and stores an encrypted key pair.

  ```javascript
  await gun.createAndStoreEncryptedPair(address, signature);
  ```

- `getAndDecryptPair(address, signature)`: Retrieves and decrypts a stored key pair.

  ```javascript
  const decryptedPair = await gun.getAndDecryptPair(address, signature);
  ```

- `shine(chain, nodeId, data, callback)`: Implements SHINE for data verification and storage on the blockchain.

  ```javascript
  gun.shine("optimismSepolia", nodeId, data, callback);
  ```

- `setToken(token)`: Sets a custom token for Gun operations.

  ```javascript
  gun.setToken("yourCustomToken");
  ```

- `getToken()`: Retrieves the current custom token.

  ```javascript
  const currentToken = gun.getToken();
  ```

## SHINE

SHINE (Secure Hash Integrity Network Ethereum) provides a mechanism for verifying data integrity using Ethereum and Gun.js.

#### SHINE Contract Configuration

Currently, SHINE supports only the Optimism Sepolia network. The contract address is managed internally:

```javascript
const SHINE_OPTIMISM_SEPOLIA = "0x43D838b683F772F08f321E5FA265ad3e333BE9C2";
```

To support other chains in the future, the plugin will select the appropriate address based on the `chain` parameter provided to the `shine` function.

#### SHINE Helper Functions

SHINE uses several internal helper functions to interact with the blockchain:

- `getSigner()`: Retrieves an Ethereum signer from the browser provider (e.g., MetaMask).
- `verifyOnChain(nodeId, contentHash)`: Verifies data integrity on the blockchain.
- `writeOnChain(nodeId, contentHash)`: Writes the content hash to the blockchain.
- `getLatestRecord(nodeId)`: Retrieves the latest record associated with a nodeId from the blockchain.

These functions are used internally by the `shine` method and are not directly exposed to the user.

### Usage Examples

#### Verifying Data by NodeId

```javascript
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

```javascript
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

## STANDALONE MODE

For users who want to run the plugin without a browser wallet, you can use the standalone mode. This requires setting up an RPC URL and a private key:

```javascript
gun.setStandaloneConfig("https://your-rpc-url", "your-private-key");
```

Make sure to keep your private key secure and never expose it in client-side code.

### Security Considerations

- Use a secure Ethereum provider (e.g., MetaMask) when interacting with functions that require signatures.
- Generated passwords and key pairs are sensitive. Handle them carefully and avoid exposing them.
- Keep Gun.js and Ethereum dependencies up to date for security.
- Be aware of gas costs associated with blockchain interactions when using SHINE.

## Contributing

We welcome contributions! Please open an issue or submit a pull request on GitHub.

## License

This project is released under the MIT license.

## Contact

For questions or support, please open an issue on GitHub: https://github.com/scobru/gun-eth
