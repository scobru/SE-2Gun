import Gun from "gun";
import "gun-eth";
import { getAccount } from "@wagmi/core";
import { currentUser, gun } from "$lib/stores";
import { get } from "svelte/store";
import { notification } from "$lib/utils/scaffold-eth/notification";
import { wagmiConfig } from "$lib/wagmi";
import type { IGunUserInstance } from "gun/types";

const MESSAGE_TO_SIGN = "Accesso a GunDB con Ethereum";

export function initializeAuth(gunInstance: Gun): IGunUserInstance {
  const user: IGunUserInstance = gunInstance.user();

  user.recall({ sessionStorage: true }, async ack => {
    if ("err" in ack) {
      console.error("Errore nel recupero della sessione:", ack.err);
    } else if (user.is && user.is.alias) {
      currentUser.set(user.is.alias as string);
      await loadUserData(user);
    }
  });

  user.on("auth", async () => {
    console.log("Utente autenticato:", user.is.alias as string);
    currentUser.set(user.is.alias as string);
    await loadUserData(user);
  });

  return user;
}

async function loadUserData(user: IGunUserInstance) {
  console.log("Caricamento dati utente...");
  const gunInstance = get(gun);
  const account = getAccount(wagmiConfig);

  if (user.is && user.is.alias) {
    const signature = await gunInstance.createSignature(MESSAGE_TO_SIGN);
    const userPair = await gunInstance.getAndDecryptPair(account.address, signature);
    console.log("Coppia utente:", userPair);
    // Qui puoi aggiungere la logica per gestire i dati dell'utente
  }
}

export async function registra(user: IGunUserInstance): Promise<string | null> {
  console.log("Registrazione in corso...");
  const gunInstance = get(gun);
  const account = getAccount(wagmiConfig);

  try {
    if (!account.isConnected) {
      return "Per favore connetti il tuo portafoglio Ethereum";
    }

    const signature = await gunInstance.createSignature(MESSAGE_TO_SIGN);

    if (!signature) {
      return "Errore durante la firma del messaggio";
    }

    await gunInstance.createAndStoreEncryptedPair(account.address, signature);

    return new Promise(resolve => {
      user.create(account.address, signature, async (ack: { ok: 0; pub: string } | { err: string }) => {
        if ("err" in ack) {
          resolve("Errore durante la registrazione: " + ack.err);
        } else {
          await loadUserData(user);
          currentUser.set(user.is.alias);
          resolve(null);
        }
      });
    });
  } catch (error) {
    return "Errore durante la registrazione: " + error.message;
  }
}

export async function accedi(user: IGunUserInstance): Promise<string | null> {
  const account = getAccount(wagmiConfig);

  if (!account.isConnected) {
    notification.error("Nessun account Ethereum connesso");
    return "Nessun account Ethereum connesso";
  }

  console.log("Accesso in corso...");
  const gunInstance = get(gun);

  try {
    if (!account.address) {
      return "Nessun account Ethereum connesso";
    }

    const signature = await gunInstance.createSignature(MESSAGE_TO_SIGN);
    if (!signature) {
      return "Errore durante la firma del messaggio";
    }

    const pair = await gunInstance.getAndDecryptPair(account.address, signature);
    console.log("Pair:", pair);
    if (!pair) {
      return "Errore nel recupero del pair dell'utente";
    }

    return new Promise(resolve => {
      user.auth(pair, async (ack: { err: string }) => {
        console.log("Risposta di autenticazione:", ack);
        if (ack.err) {
          resolve("Errore di accesso: " + ack.err);
        } else {
          console.log("Accesso riuscito");
          currentUser.set(user.is.alias);
          await loadUserData(user);
          resolve(null);
        }
      });
    });
  } catch (error) {
    return "Errore durante l'accesso: " + error.message;
  }
}

export function esci(user: IGunUserInstance): void {
  user.leave();
  currentUser.set(null);
  // Puoi aggiungere qui altre operazioni di pulizia se necessario
}
