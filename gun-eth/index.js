const Gun = require("gun/gun");
const SEA = require("gun/sea");
const ethers = require("ethers");
const SHINE = require("./SHINE.json");

/* import Gun from "gun";
import SEA from "gun/sea";
import { ethers } from "ethers";
import SHINE from "./SHINE.json"; */

const SHINE_ABI = SHINE.abi;
const SHINE_OPTIMISM_SEPOLIA = SHINE.address;

let SHINE_CONTRACT_ADDRESS;

let customToken = "";

Gun.chain.setToken = function (token) {
  if (typeof token === "string" && token.length > 0) {
    customToken = token;
    console.log("Token impostato con successo:", token);
  } else {
    console.error("Token non valido. Deve essere una stringa non vuota.");
  }
  return this;
};

ctx.on("put", function (msg) {
  const to = this.to;
  // Usa il token personalizzato
  msg.headers = {
    token: customToken,
  };
  to.next(msg); // passa al prossimo middleware
});

// Aggiungi il metodo alla catena di Gun
Gun.chain.verifySignature = async function (message, signature) {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress;
  } catch (error) {
    console.error("Errore durante la verifica della firma:", error);
    return null;
  }
};

Gun.chain.generatePassword = function (signature) {
  try {
    // Usa SHA-256 per derivare una password dalla firma
    const hexSignature = ethers.hexlify(signature);
    const hash = ethers.keccak256(hexSignature);

    console.log("Password generata:", hash);
    return hash;
  } catch (error) {
    console.error("Errore nella generazione della password:", error);
    return null;
  }
};

Gun.chain.createSignature = async function (message) {
  try {
    // Controlla se window.ethereum è disponibile (metamask o altro provider)
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);
      console.log("Firma creata:", signature);
      return signature;
    } else {
      throw new Error("Provider Ethereum non trovato");
    }
  } catch (error) {
    console.error("Errore durante la creazione della firma:", error);
    return null;
  }
};

Gun.chain.createAndStoreEncryptedPair = async function (address, signature) {
  try {
    const gun = this;
    const pair = await SEA.pair();
    const encryptedPair = await SEA.encrypt(JSON.stringify(pair), signature);

    await gun.get("users").get(address).put({ encryptedPair });
    console.log("Pair crittografato e archiviato per:", address);
  } catch (error) {
    console.error(
      "Errore durante la creazione e l'archiviazione del pair crittografato:",
      error
    );
  }
};

Gun.chain.getAndDecryptPair = async function (address, signature) {
  try {
    const gun = this;
    const encryptedData = await gun
      .get("users")
      .get(address)
      .get("encryptedPair")
      .then();
    if (!encryptedData) {
      throw new Error("Nessun dato crittografato trovato per questo indirizzo");
    }

    const decryptedPair = await SEA.decrypt(encryptedData, signature);

    console.log(decryptedPair);
    return decryptedPair;
  } catch (error) {
    console.error(
      "Errore durante il recupero e la decrittazione del pair:",
      error
    );
    return null;
  }
};

Gun.chain.shine = function (chain, nodeId, data, callback) {
  console.log("SHINE plugin called with:", { chain, nodeId, data });

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

  // Funzione per ottenere il signer
  const getSigner = async () => {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      return provider.getSigner();
    } else {
      throw new Error("Ethereum provider not found");
    }
  };

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
