# GUN-ETH

<img src="https://imgs.search.brave.com/RM76D4wyToxCzGffJLw33O_L3glhpIVS3KLvXehpMt8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dXNlcmxvZ29zLm9y/Zy9maWxlcy9sb2dv/cy9mZXJuYW5kb3Nh/bnR1Y2NpLzI5NDY5/X2d1bmRiLWxvZ28u/cG5n" alt="gun" width="200"/>
<img src="https://imgs.search.brave.com/kQyriTMPqw42DEhIQj3eEKIcLZu_C4nNIVR8KtAn3lo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bG9nby53aW5lL2Ev/bG9nby9FdGhlcmV1/bS9FdGhlcmV1bS1E/aWFtb25kLUxvZ28u/d2luZS5zdmc" alt="eth" width="200"/>

## Table of Contents

1. [DESCRIPTION](#description)
2. [SMART CONTRACT](#smart-contract)
3. [KEY FEATURES](#key-features)
4. [HOW TO INSTALL](#how-to-install)
5. [HOW TO USE](#how-to-use)
6. [HOW IT WORKS](#how-it-works)  
7. [CORE FUNCTIONS](#core-functions)
8. [SHINE](#shine)
9. [STANDALONE MODE](#standalone-mode)
10. [SECURITY CONSIDERATIONS](#security-considerations)
11. [CONTRIBUTING](#contributing)
12. [LICENSE](#license)
13. [CONTACT](#contact)

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


## HOW IT WORKS

### Create KeyPair


[![](https://mermaid.ink/img/pako:eNpdUUtuwjAQvcrIGzZwgSwqJSRQhEorwqZNWLjxkFgkduSPEAJu1Fv0Yp0khaj1wh6P3s_jCyu0QBawQ61PRcWNg12cKxhWmK2T97dwtYVlskm24W71utnDbPYE0SWVpUIDJdLOHQIHSx3uvEE4SVdBJS2ceF2juz0Eo458Tb-_rjDPlnfqGs8tl2agpUm4f-DnvVmcJaow59aBq_6hR09vpSqh9OqvQtwrJGQ2sBU9F7TqgHEEEzpm6KoJEGjiLRrbl1wIg9aOMkkvs8hSp8kLhzgo4PgbRnaKn3E0MhY945miiz2bsgZNw6WgSV86SM4oTIM5C6gU3Bxz1rfVjbDcO52eVcECZzxOmdG-rFhw4LWlm28FDS2WvDS8eXRRSIr2Mnxm_6dT1nL1ofUdc_sBNpWchQ?type=png)](https://mermaid.live/edit#pako:eNpdUUtuwjAQvcrIGzZwgSwqJSRQhEorwqZNWLjxkFgkduSPEAJu1Fv0Yp0khaj1wh6P3s_jCyu0QBawQ61PRcWNg12cKxhWmK2T97dwtYVlskm24W71utnDbPYE0SWVpUIDJdLOHQIHSx3uvEE4SVdBJS2ceF2juz0Eo458Tb-_rjDPlnfqGs8tl2agpUm4f-DnvVmcJaow59aBq_6hR09vpSqh9OqvQtwrJGQ2sBU9F7TqgHEEEzpm6KoJEGjiLRrbl1wIg9aOMkkvs8hSp8kLhzgo4PgbRnaKn3E0MhY945miiz2bsgZNw6WgSV86SM4oTIM5C6gU3Bxz1rfVjbDcO52eVcECZzxOmdG-rFhw4LWlm28FDS2WvDS8eXRRSIr2Mnxm_6dT1nL1ofUdc_sBNpWchQ)

### Retrive KeyPair
----

[![](https://mermaid.ink/img/pako:eNplUsluwjAQ_ZWRz_ADObQCEiggOLAc2iQHN56ABbGjsU2FAv_erBBBLs7Yb5lnT8ESLZB5LD3rv-TIycLOjxSU3yjc7kabnQcbtCTxgrDEa84lxTAcfsC42BskyElfpEADXAhCU65KgJEHxa0j_Lw3WuOKcvtGc4NJ-NBDldA1tyjg1ChDSjqDmVP-OG6Ik9rLL4J3qHZKdPr-Uz8IfayxD6QzUh26RnvNtRZBbTEtWprUCoxLkjJL6s6dwfRpMKsCOFIg8KWnuI9d6xt8dVAk0uTBXvHfM4LVHTfut18x5i-M9spBadskjvsXWjEWL4yVNHXe7j00vSWe1YmXYbD2nw7Uvkrn8NWAmmLeLxZNwQYsQ8q4FOX4FNVRxOwRM4yYV_4KTqeI1dvqXmK5s3p7VQnzLDkcMNLucGReys-mrFwuuEVf8gPx7LGLQlpNq2ZC60EdsJyrH607zP0f6c7pXw?type=png)](https://mermaid.live/edit#pako:eNplUsluwjAQ_ZWRz_ADObQCEiggOLAc2iQHN56ABbGjsU2FAv_erBBBLs7Yb5lnT8ESLZB5LD3rv-TIycLOjxSU3yjc7kabnQcbtCTxgrDEa84lxTAcfsC42BskyElfpEADXAhCU65KgJEHxa0j_Lw3WuOKcvtGc4NJ-NBDldA1tyjg1ChDSjqDmVP-OG6Ik9rLL4J3qHZKdPr-Uz8IfayxD6QzUh26RnvNtRZBbTEtWprUCoxLkjJL6s6dwfRpMKsCOFIg8KWnuI9d6xt8dVAk0uTBXvHfM4LVHTfut18x5i-M9spBadskjvsXWjEWL4yVNHXe7j00vSWe1YmXYbD2nw7Uvkrn8NWAmmLeLxZNwQYsQ8q4FOX4FNVRxOwRM4yYV_4KTqeI1dvqXmK5s3p7VQnzLDkcMNLucGReys-mrFwuuEVf8gPx7LGLQlpNq2ZC60EdsJyrH607zP0f6c7pXw)

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


[![](https://mermaid.ink/img/pako:eNplk1GTmjAQx79KJs_oICAiD9epQoX25Dq1006LPqRkPTMHiRODdx763S8Ez7N3PCXZ__73txvS4EJQwCFel-Kx2BCp0M9oyZH-PucL1e4XSZrF6BdItmYFUUzwFer1btCkSfm2ViHi2iGln05d2qQNHv_A7oim-Q9QksEeECWKoLUUFZrVPJqsOu3UGEVNZKKi5heX6M0lzuMnJUmhUCG4Aq4SstusrmWZOKIvecxpiIwTF6pzO6tiU2aWmx4OHYvgPd0u42fJzEiSjmRPSkYvilek5A0pzWegUEkU7BSSUAhJu-b-laJ4uPZNLoBf3wHuzUDhlTE1AN-uRO8E19Nt_W41AwepGRCHx_MlnLW3xmyeTyW08Y9zmxtBpm9YSECM_3crmQne5b8l08mCf-zqzii-d7CZrm5GumvN6ApbuAJZEUb1b9W0CUusNlDBEod6SYl8WGJzzE9aS2olFgde4FDJGiwsRX2_weGalDu9q7faGiJG7iWpLqdbwnHY4Ccc9pxxf-wEA9exPc92A384tPABh8NB33WDwdCxfcfxAy84WfhZCG0x6HuuZ49HI98PRjpojywMlGn2efcSzIMwNf6ahBbr9AJRuPoz?type=png)](https://mermaid.live/edit#pako:eNplk1GTmjAQx79KJs_oICAiD9epQoX25Dq1006LPqRkPTMHiRODdx763S8Ez7N3PCXZ__73txvS4EJQwCFel-Kx2BCp0M9oyZH-PucL1e4XSZrF6BdItmYFUUzwFer1btCkSfm2ViHi2iGln05d2qQNHv_A7oim-Q9QksEeECWKoLUUFZrVPJqsOu3UGEVNZKKi5heX6M0lzuMnJUmhUCG4Aq4SstusrmWZOKIvecxpiIwTF6pzO6tiU2aWmx4OHYvgPd0u42fJzEiSjmRPSkYvilek5A0pzWegUEkU7BSSUAhJu-b-laJ4uPZNLoBf3wHuzUDhlTE1AN-uRO8E19Nt_W41AwepGRCHx_MlnLW3xmyeTyW08Y9zmxtBpm9YSECM_3crmQne5b8l08mCf-zqzii-d7CZrm5GumvN6ApbuAJZEUb1b9W0CUusNlDBEod6SYl8WGJzzE9aS2olFgde4FDJGiwsRX2_weGalDu9q7faGiJG7iWpLqdbwnHY4Ccc9pxxf-wEA9exPc92A384tPABh8NB33WDwdCxfcfxAy84WfhZCG0x6HuuZ49HI98PRjpojywMlGn2efcSzIMwNf6ahBbr9AJRuPoz)



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
