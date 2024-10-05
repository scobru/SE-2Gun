# gun-eth

## Description

gun-eth is a plugin for GunDB that integrates Ethereum and Web3 functionality. This plugin extends GunDB's capabilities by allowing interaction with the Ethereum blockchain and providing cryptographic and signature management features.

## Key Features

- Ethereum signature verification
- Signature-based password generation
- Signature creation using Ethereum providers (e.g., MetaMask)

## Example

[gun-eth dapp](https://gun-eth.vercel.app/)

## Installation

```bash
npm install gun-eth
```

## Usage

```javascript
const Gun = require("gun");
require("gun-eth");

const gun = Gun();

// Now you can use the new features
```

## Main Functions

- `gun.verifySignature(message, signature)`: Verifies an Ethereum signature
- `gun.generatePassword(signature)`: Generates a password based on a signature
- `gun.createSignature(message)`: Creates a signature using an Ethereum provider

## Dependencies

- gun: ^0.2020.1239
- ethers: ^6.0.0

## Contributing

We welcome contributions! Please open an issue or submit a pull request on GitHub.

## License

This project is released under the MIT license.

## Contact

For questions or support, please open an issue on GitHub: https://github.com/scobru/gun-eth
