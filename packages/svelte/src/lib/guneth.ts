import Gun from 'gun/gun';
import SEA from 'gun/sea';
import { ethers } from 'ethers';

// Aggiungi il metodo alla catena di Gun
Gun.chain.verifySignature = async function (message, signature) {
    try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        return recoveredAddress;
    } catch (error) {
        console.error('Errore durante la verifica della firma:', error);
        return null;
    }
};
Gun.chain.generatePassword = function (signature) {
    try {
        // Usa SHA-256 per derivare una password dalla firma
        const hexSignature = ethers.hexlify(signature);
        const hash = ethers.keccak256(hexSignature);

        console.log('Password generata:', hash);
        return hash;
    } catch (error) {
        console.error('Errore nella generazione della password:', error);
        return null;
    }
};

Gun.chain.createSignature = async function (message) {
    try {
        // Controlla se window.ethereum è disponibile (metamask o altro provider)
        if (typeof window.ethereum !== 'undefined') {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
            console.log(provider)
            const signer = await provider.getSigner();

            const signature = await signer.signMessage(message);
            console.log('Firma creata:', signature);
            return signature;
        } else {
            throw new Error('Provider Ethereum non trovato');
        }
    } catch (error) {
        console.error('Errore durante la creazione della firma:', error);
        return null;
    }
};

Gun.chain.createAndStoreEncryptedPair = async function (address: string, signature: string) {
    try {
        const gun = this;
        const pair = await SEA.pair();
        const encryptedPair = await SEA.encrypt(JSON.stringify(pair), signature);

        await gun.get('users').get(address).put({ encryptedPair });
        console.log('Pair crittografato e archiviato per:', address);
    } catch (error) {
        console.error('Errore durante la creazione e l\'archiviazione del pair crittografato:', error);
    }
};

Gun.chain.getAndDecryptPair = async function (address: string, signature: string) {
    try {
        const gun = this;
        const encryptedData = await gun.get('users').get(address).get('encryptedPair').then();
        if (!encryptedData) {
            throw new Error('Nessun dato crittografato trovato per questo indirizzo');
        }

        const decryptedPair = await SEA.decrypt(encryptedData, signature);

        console.log(decryptedPair)
        return decryptedPair;
    } catch (error) {
        console.error('Errore durante il recupero e la decrittazione del pair:', error);
        return null;
    }
};
