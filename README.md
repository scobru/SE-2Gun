# 🏗️ ScafoldETH2-Gun 🔫 - SE2-Gun

## What is SE2-Gun?

SE2-Gun is a powerful boilerplate that integrates ScaffoldETH2 with Gun.js and Ethereum blockchain functionality. It provides a robust infrastructure for developing decentralized applications (dApps) with decentralized storage, Ethereum-based authentication, and blockchain data integrity verification. This boilerplate is ideal for developers looking to create scalable and secure dApps with an end-to-end decentralized architecture.

## Table of Contents

- [SE2-Gun-Extension](#se2-gun-extension)
- [GUN-ETH Plugin](#gun-eth-plugin)
  - [SHINE](#shine)
- [Authentication](#authentication)
- [Inspector](#inspector)
- [Block Explorer](#block-explorer)

## Important Notice ⚠️

**Attention**: Currently, this Gun.js implementation is not connected to any external relay. As a result, all data saved and managed through Gun will exclusively use your browser's local storage. This means:

1. Data will not persist across different browser sessions or devices.
2. Data sharing between users will be limited.
3. Clearing your browser cache will result in the loss of all saved data.

It is recommended to use this configuration for development and testing purposes only. For a complete and functional implementation in a production environment, it is necessary to configure and connect Gun to appropriate relays to ensure data persistence and synchronization.

## SE2-Gun-Extension

The SE2-Gun-Extension is a plugin for ScaffoldETH2 that provides a ready to go installation of Gun and the Gun-Eth plugin.

**[SE2-Gun-Extension](https://github.com/scobru/SE-2Gun-extension)**

### How to install

```bash
npx create-eth@latest -e {scobru/SE-2Gun-extension}
```

## GUN-ETH Plugin

**[GUN-ETH package documentation](https://github.com/scobru/SE-2Gun/tree/main/packages/gun-eth)**

The Gun-eth plugin extends Gun.js functionality to integrate seamlessly with Ethereum blockchain capabilities. It provides a suite of tools for working with Ethereum signatures, managing encrypted key pairs, and implementing the SHINE for blockchain data verification.

### SHINE (Secure Hash Integrity Network Ethereum)

SHINE provides a mechanism for verifying data integrity using Ethereum and Gun.js.

1. **Data Storage**: When saving data, a content hash is generated and stored in both Gun.js and on the Ethereum blockchain.
2. **Data Verification**: To verify data, the stored hash is compared with a hash generated from the data retrieved from Gun.js.
3. **Blockchain Interaction**: The plugin interacts with an Ethereum smart contract to store and verify data hashes.

**[SHINE examples](https://github.com/scobru/SE-2Gun/tree/main/packages/gun-eth)**

## Authentication

The authentication process in SHINE combines Ethereum signatures with Gun.js for secure and decentralized user management:

1. **Signature**: The user signs a message with their Ethereum wallet, proving ownership of the address.
2. **Encrypted Identity**: The signature is used to generate and encrypt a unique identity for the user.
3. **Gun Registration**: This encrypted identity is then registered and stored in Gun.js, creating a decentralized user account.

This process ensures secure, pseudonymous authentication without relying on centralized servers or exposing sensitive information.

## Inspector

The Inspector component provides a powerful tool for exploring and manipulating Gun.js data:

- **Data Visualization**: View the structure and content of Gun.js data in real-time.
- **Node Navigation**: Easily navigate through the graph structure of Gun.js data.
- **Data Manipulation**: Add, edit, or delete nodes directly from the interface.
- **Search Functionality**: Quickly find specific nodes or data within the Gun.js graph.
- **Real-time Updates**: See changes to the data reflected immediately in the interface.

The Inspector is an essential tool for developers working with Gun.js, providing insights into data structure and facilitating debugging and data management tasks.

## Block Explorer

The Block Explorer is a tool for exploring the data on the blockchain.
