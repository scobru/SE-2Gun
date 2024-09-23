import Gun from 'gun/gun';
import { ethers } from 'ethers';

// Aggiungi il metodo alla catena di Gun
Gun.chain.verifySignature = async function (message, signature) {
  try {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    return recoveredAddress;
  } catch (error) {
    console.error('Errore durante la verifica della firma:', error);
    return null;
  }
};

// Funzione per generare una password dalla firma
Gun.chain.generatePassword = function (signature) {
  try {
    // Usa SHA-256 per derivare una password dalla firma
    const hash = kecc
    
    console.log('Password generata:', hash);
    return hash;
  } catch (error) {
    console.error('Errore nella generazione della password:', error);
    return null;
  }
};
