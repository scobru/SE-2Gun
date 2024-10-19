(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["gun", "gun/sea", "ethers"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("gun/gun"), require("gun/sea"), require("ethers"));
    } else {
        factory(root.Gun, root.SEA, root.ethers);
    }
})(typeof self !== "undefined" ? self : this, function (Gun, SEA, ethers) {
    console.log('Factory del plugin Gun-Eth chiamata');

    const MESSAGE_TO_SIGN = "Accesso a GunDB con Ethereum";


    // Funzione per verificare se ethers è disponibile
    function checkEthers() {
        if (typeof ethers === 'undefined') {
            console.error('Ethers.js non è disponibile. Assicurati che sia caricato prima di questo script.');
            return false;
        }
        console.log('Ethers version:', ethers.version);
        return true;
    }

    // Variabili globali
    let SHINE_ABI = [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes",
              "name": "nodeId",
              "type": "bytes"
            },
            {
              "indexed": false,
              "internalType": "bytes32",
              "name": "contentHash",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "updater",
              "type": "address"
            }
          ],
          "name": "DataUpdated",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "bytes[]",
              "name": "nodeIds",
              "type": "bytes[]"
            },
            {
              "internalType": "bytes32[]",
              "name": "contentHashes",
              "type": "bytes32[]"
            }
          ],
          "name": "batchUpdateData",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes",
              "name": "nodeId",
              "type": "bytes"
            }
          ],
          "name": "getLatestRecord",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes",
              "name": "",
              "type": "bytes"
            }
          ],
          "name": "nodeData",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "contentHash",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "updater",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes",
              "name": "nodeId",
              "type": "bytes"
            },
            {
              "internalType": "bytes32",
              "name": "contentHash",
              "type": "bytes32"
            }
          ],
          "name": "updateData",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes",
              "name": "nodeId",
              "type": "bytes"
            },
            {
              "internalType": "bytes32",
              "name": "contentHash",
              "type": "bytes32"
            }
          ],
          "name": "verifyData",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]

    let SHINE_OPTIMISM_SEPOLIA = "0x43D838b683F772F08f321E5FA265ad3e333BE9C2";
    let SHINE_CONTRACT_ADDRESS;
    let rpcUrl = "";
    let privateKey = "";

    /**
     * Funzione per ottenere il signer
     * @returns {Promise<ethers.Signer>} Il signer.
     */
    const getSigner = async () => {
        if (rpcUrl && privateKey) {
            // Modalità standalone
            const provider = new ethers.JsonRpcProvider(rpcUrl);
            return new ethers.Wallet(privateKey, provider);
        } else if (
            typeof window !== "undefined" &&
            typeof window.ethereum !== "undefined"
        ) {
            // Modalità browser
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.BrowserProvider(window.ethereum);
            return provider.getSigner();
        } else {
            throw new Error("No valid Ethereum provider found");
        }
    };

    /**
     * Sets standalone configuration for Gun.
     * @param {string} newRpcUrl - The new RPC URL.
     * @param {string} newPrivateKey - The new private key.
     * @returns {Gun} The Gun instance for chaining.
     */
    Gun.chain.setStandaloneConfig = function (newRpcUrl, newPrivateKey) {
        rpcUrl = newRpcUrl;
        privateKey = newPrivateKey;
        console.log("Standalone configuration set");
        return this;
    };

    /**
     * Verifies an Ethereum signature.
     * @param {string} message - The original message that was signed.
     * @param {string} signature - The signature to verify.
     * @returns {Promise<string|null>} The recovered address or null if verification fails.
     */
    Gun.chain.verifySignature = async function (message, signature) {
        try {
            const recoveredAddress = ethers.verifyMessage(message, signature);
            return recoveredAddress;
        } catch (error) {
            console.error("Error verifying signature:", error);
            return null;
        }
    };

    /**
     * Generates a password from a signature.
     * @param {string} signature - The signature to derive the password from.
     * @returns {string|null} The generated password or null if generation fails.
     */
    Gun.chain.generatePassword = function (signature) {
        try {
            const hexSignature = ethers.hexlify(signature);
            const hash = ethers.keccak256(hexSignature);
            console.log("Generated password:", hash);
            return hash;
        } catch (error) {
            console.error("Error generating password:", error);
            return null;
        }
    };

    /**
     * Creates an Ethereum signature for a given message.
     * @param {string} message - The message to sign.
     * @returns {Promise<string|null>} The signature or null if signing fails.
     */
    Gun.chain.createSignature = async function (message) {
        try {
            // Verifica se il messaggio è uguale a MESSAGE_TO_SIGN
            if (message !== MESSAGE_TO_SIGN) {
                throw new Error("Invalid message, valid message is: " + MESSAGE_TO_SIGN);
            }
            const signer = await getSigner();
            const signature = await signer.signMessage(message);
            console.log("Signature created:", signature);
            return signature;
        } catch (error) {
            console.error("Error creating signature:", error);
            return null;
        }
    };

    /**
     * Creates and stores an encrypted key pair for a given address.
     * @param {string} address - The Ethereum address to associate with the key pair.
     * @param {string} signature - The signature to use for encryption.
     * @returns {Promise<void>}
     */
    Gun.chain.createAndStoreEncryptedPair = async function (address, signature) {
        try {
            const gun = this;
            const pair = await SEA.pair();
            const encryptedPair = await SEA.encrypt(JSON.stringify(pair), signature);
            await gun.get("gun-eth").get("users").get(address).put({ encryptedPair });
            console.log("Encrypted pair stored for:", address);
        } catch (error) {
            console.error("Error creating and storing encrypted pair:", error);
        }
    };

    /**
     * Retrieves and decrypts a stored key pair for a given address.
     * @param {string} address - The Ethereum address associated with the key pair.
     * @param {string} signature - The signature to use for decryption.
     * @returns {Promise<Object|null>} The decrypted key pair or null if retrieval fails.
     */
    Gun.chain.getAndDecryptPair = async function (address, signature) {
        try {
            const gun = this;
            const encryptedData = await gun
                .get("gun-eth")
                .get("users")
                .get(address)
                .get("encryptedPair")
                .then();
            if (!encryptedData) {
                throw new Error("No encrypted data found for this address");
            }
            const decryptedPair = await SEA.decrypt(encryptedData, signature);
            console.log(decryptedPair);
            return decryptedPair;
        } catch (error) {
            console.error("Error retrieving and decrypting pair:", error);
            return null;
        }
    };

    /**
     * SHINE (Secure Hybrid Information and Network Environment) functionality.
     * @param {string} chain - The blockchain to use (e.g., "optimismSepolia").
     * @param {string} nodeId - The ID of the node to verify or write.
     * @param {Object} data - The data to write (if writing).
     * @param {Function} callback - Callback function to handle the result.
     * @returns {Gun} The Gun instance for chaining.
     */
    Gun.chain.shine = function (chain, nodeId, data, callback) {
        console.log("SHINE plugin called with:", { chain, nodeId, data });

        if (!checkEthers()) {
            if (callback) callback({ err: "Ethers.js non è disponibile" });
            return this;
        }

        if (typeof callback !== "function") {
            console.error("Callback must be a function");
            return this;
        }

        const gun = this;

        // Seleziona l'indirizzo basato sulla catena
        if (chain === "optimismSepolia") {
            SHINE_CONTRACT_ADDRESS = SHINE_OPTIMISM_SEPOLIA;
        } else {
            throw new Error("Chain not supported");
        }

        // Funzione per verificare on-chain
        const verifyOnChain = async (nodeId, contentHash) => {
            console.log("Verifying on chain:", { nodeId, contentHash });
            const signer = await getSigner();
            const contract = new ethers.Contract(
                SHINE_CONTRACT_ADDRESS,
                SHINE_ABI,
                signer
            );
            const [isValid, timestamp, updater] = await contract.verifyData(
                ethers.toUtf8Bytes(nodeId),
                contentHash
            );
            console.log("Verification result:", { isValid, timestamp, updater });
            return { isValid, timestamp, updater };
        };

        // Funzione per scrivere on-chain
        const writeOnChain = async (nodeId, contentHash) => {
            console.log("Writing on chain:", { nodeId, contentHash });
            const signer = await getSigner();
            const contract = new ethers.Contract(
                SHINE_CONTRACT_ADDRESS,
                SHINE_ABI,
                signer
            );
            const tx = await contract.updateData(
                ethers.toUtf8Bytes(nodeId),
                contentHash
            );
            console.log("Transaction sent:", tx.hash);
            const receipt = await tx.wait();
            console.log("Transaction confirmed:", receipt);
            return tx;
        };

        // Nuova funzione per ottenere l'ultimo record dalla blockchain
        const getLatestRecord = async (nodeId) => {
            const signer = await getSigner();
            const contract = new ethers.Contract(
                SHINE_CONTRACT_ADDRESS,
                SHINE_ABI,
                signer
            );
            const [contentHash, timestamp, updater] = await contract.getLatestRecord(
                ethers.toUtf8Bytes(nodeId)
            );
            console.log("Latest record from blockchain:", {
                nodeId,
                contentHash,
                timestamp,
                updater,
            });
            return { contentHash, timestamp, updater };
        };

        // Processo SHINE
        if (nodeId && !data) {
            // Caso 1: Utente passa solo il nodo
            gun.get(nodeId).once(async (existingData) => {
                if (!existingData) {
                    if (callback) callback({ err: "Node not found in GunDB" });
                    return;
                }

                console.log("existingData", existingData);

                // Usa il contentHash memorizzato invece di ricalcolarlo
                const contentHash = existingData._contentHash;
                console.log("contentHash", contentHash);

                if (!contentHash) {
                    if (callback) callback({ err: "No content hash found for this node" });
                    return;
                }

                try {
                    const { isValid, timestamp, updater } = await verifyOnChain(
                        nodeId,
                        contentHash
                    );
                    const latestRecord = await getLatestRecord(nodeId);

                    if (isValid) {
                        if (callback)
                            callback({
                                ok: true,
                                message: "Data verified on blockchain",
                                timestamp,
                                updater,
                                latestRecord,
                            });
                    } else {
                        if (callback)
                            callback({
                                ok: false,
                                message: "Data not verified on blockchain",
                                latestRecord,
                            });
                    }
                } catch (error) {
                    if (callback) callback({ err: error.message });
                }
            });
        } else if (data && !nodeId) {
            // Caso 2: Utente passa solo il testo (data)
            const newNodeId = Gun.text.random();
            const dataString = JSON.stringify(data);
            const contentHash = ethers.keccak256(ethers.toUtf8Bytes(dataString));

            gun
                .get(newNodeId)
                .put({ ...data, _contentHash: contentHash }, async (ack) => {
                    console.log("ack", ack);
                    if (ack.err) {
                        if (callback) callback({ err: "Error saving data to GunDB" });
                        return;
                    }

                    try {
                        const tx = await writeOnChain(newNodeId, contentHash);
                        if (callback)
                            callback({
                                ok: true,
                                message: "Data written to GunDB and blockchain",
                                nodeId: newNodeId,
                                txHash: tx.hash,
                            });
                    } catch (error) {
                        if (callback) callback({ err: error.message });
                    }
                });
        } else {
            if (callback)
                callback({
                    err: "Invalid input. Provide either nodeId or data, not both.",
                });
        }

        return gun;
    };

    /**
     * Converts a Gun private key to an Ethereum account.
     * @param {string} gunPrivateKey - The Gun private key in base64url format.
     * @returns {Object} An object containing the Ethereum account and public key.
     */
    Gun.chain.gunToEthAccount = function (gunPrivateKey) {
        // Function to convert base64url to hex
        const base64UrlToHex = (base64url) => {
            const padding = "=".repeat((4 - (base64url.length % 4)) % 4);
            const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/") + padding;
            const binary = atob(base64);
            return Array.from(binary, (char) =>
                char.charCodeAt(0).toString(16).padStart(2, "0")
            ).join("");
        };

        // Convert Gun private key to hex format
        const hexPrivateKey = "0x" + base64UrlToHex(gunPrivateKey);

        // Create an Ethereum wallet from the private key
        const wallet = new ethers.Wallet(hexPrivateKey);

        // Get the public address (public key)
        const publicKey = wallet.address;

        return {
            account: wallet,
            publicKey: publicKey,
        };
    };

    /**
     * Sets SHINE configuration.
     * @param {Object} abi - The ABI of the SHINE contract.
     * @param {string} optimismSepoliaAddress - The contract address on Optimism Sepolia.
     * @returns {Gun} The Gun instance for chaining.
     */
    Gun.chain.setShineConfig = function (abi, optimismSepoliaAddress) {
        SHINE_ABI = abi;
        SHINE_OPTIMISM_SEPOLIA = optimismSepoliaAddress;
        console.log("SHINE configuration set");
        return this;
    };

    console.log('Plugin Gun-Eth caricato con successo');
});
