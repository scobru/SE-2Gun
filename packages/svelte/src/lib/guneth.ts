import Gun from 'gun/gun';
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
