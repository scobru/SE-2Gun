# gun-eth

## Description

gun-eth is a plugin for GunDB that integrates Ethereum and Web3 functionality. This plugin extends GunDB's capabilities by allowing interaction with the Ethereum blockchain and providing cryptographic and signature management features.

SHINE Smart Contract deployed on Optimism Sepolia: [0x43D838b683F772F08f321E5FA265ad3e333BE9C2](https://sepolia-optimism.etherscan.io/address/0x43D838b683F772F08f321E5FA265ad3e333BE9C2)

Currently, the contract is deployed only on Optimism Sepolia. In the future, it will be deployed on multiple chains.

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

## Contributing

We welcome contributions! Please open an issue or submit a pull request on GitHub.

## License

This project is released under the MIT license.

## Contact

For questions or support, please open an issue on GitHub: https://github.com/scobru/gun-eth
