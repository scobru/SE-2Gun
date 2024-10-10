# 🏗️ ScafoldETH2-Gun 🔫 - SE2-Gun

## What is SE2-Gun?

SE2-Gun is a powerful boilerplate that integrates ScaffoldETH2 with Gun.js and Ethereum blockchain functionality. It provides a robust infrastructure for developing decentralized applications (dApps) with decentralized storage, Ethereum-based authentication, and blockchain data integrity verification. This boilerplate is ideal for developers looking to create scalable and secure dApps with an end-to-end decentralized architecture.

## Table of Contents

- [SE2-Gun-Extension](#se2-gun-extension)
- [GUN-ETH Plugin](#gun-eth-plugin)
- [Authentication](#authentication)
- [Inspector](#inspector)
- [Block Explorer](#block-explorer)
- [Dev Stack](#dev-stack)

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

**[Gun-Eth Plugin](https://github.com/scobru/gun-eth)**

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

## Dev Stack

SE2-Gun utilizes a powerful technology stack to provide a comprehensive and decentralized dApp development experience:

- **GunDB**: A decentralized database for secure data storage and retrieval.
- **Scaffold-ETH**: A development framework that combines Svelte and Hardhat for building and deploying Ethereum smart contracts.
- **Svelte**: A modern JavaScript framework for building fast and reactive user interfaces.
- **Hardhat**: A development environment for Ethereum software, allowing for testing, deployment, and debugging of smart contracts.
- **Ethereum**: Used for signature-based authentication and data encryption.
- **Optimism Sepolia**: The testnet where the SHINE contract is currently deployed.

This stack offers several advantages:

1. **Full Decentralization**: The application is designed to be completely decentralized, eliminating the need for centralized servers.
2. **Efficient Data Storage**: GunDB allows storing only necessary data on the blockchain, optimizing storage costs and improving performance.
3. **Ethereum-Based Encryption**: SE2-Gun generates cryptographic pairs using Ethereum addresses, providing a secure and reliable method for data encryption and user authentication.
4. **Rapid Development**: Svelte and Scaffold-ETH facilitate quick and efficient dApp development.
5. **Robust Testing and Debugging**: Hardhat provides powerful tools for testing and debugging smart contracts.

This project is a fork of Scaffold-ETH2, with the addition of GunDB and the Gun-Eth plugin.
tnx to [scaffold-eth-svelte](https://github.com/ByteAtATime/scaffold-eth-svelte) for the SE2-Gun-Extension and the Gun-Eth plugin.

## Contributing

We welcome contributions to SE2-Gun! If you'd like to contribute, please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them with clear, descriptive messages
4. Push your changes to your fork
5. Submit a pull request to the main repository

Please ensure that your code adheres to the existing style and that all tests pass before submitting a pull request.

## License

SE2-Gun is released under the MIT License. See the [LICENSE](./LICENSE.md) file for more details.
