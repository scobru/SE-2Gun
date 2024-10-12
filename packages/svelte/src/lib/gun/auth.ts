import Gun from "gun";
import "gun-eth";
import { getAccount } from "@wagmi/core";
import { currentUser, gun } from "$lib/stores";
import { get } from "svelte/store";
import { notification } from "$lib/utils/scaffold-eth/notification";
import { wagmiConfig } from "$lib/wagmi";
import type { IGunUserInstance } from "gun/types";
import { auth, leave, useUser } from "./user";
import { useGun } from "./gun";

const MESSAGE_TO_SIGN = "Accesso a GunDB con Ethereum";

export function initializeAuth() {
  const gun = useGun();

  gun.user().recall({ sessionStorage: true }, async ack => {
    const user = gun.user();
    if ("err" in ack) {
      console.error("Errore nel recupero della sessione:", ack.err);
    } else if (user.is && user.is.alias) {
      currentUser.set(user.is.alias as string);
      await loadUserData(user);
    }
  });

  gun.user().on("auth", async () => {
    console.log("Utente autenticato:", user.is.alias as string);
    currentUser.set(user.is.alias as string);
    await loadUserData(user);
  });

  return gun.user();
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

export async function signIn(): Promise<string | null> {
  console.log("Registrazione in corso...");
  const gunInstance = useGun();
  const account = getAccount(wagmiConfig);
  const { user } = useUser();

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
      user.db.create(account.address, signature, async (ack: { ok: 0; pub: string } | { err: string }) => {
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

export async function login(): Promise<string | null> {
  const account = getAccount(wagmiConfig);

  if (!account.isConnected) {
    notification.error("Nessun account Ethereum connesso");
    return "Nessun account Ethereum connesso";
  }

  console.log("Accesso in corso...");
  const gunInstance = useGun();
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

    await auth(pair, async (ack: { err: string }) => {
      console.log("Risposta di autenticazione:", ack);
      if (ack.err) {
        console.error("Errore di accesso: " + ack.err);
      } else {
        console.log("Accesso riuscito");
        const { user } = useUser();
        user.update(u => ({ ...u, auth: true }));
        console.log("User:", get(user));
      }
    });
  } catch (error) {
    return "Errore durante l'accesso: " + error.message;
  }
}

export function logout(): void {
  leave();
}
