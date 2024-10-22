import { getAccount } from "@wagmi/core";
import { derived, get, writable } from "svelte/store";
import { notification } from "$lib/utils/scaffold-eth/notification";
import { wagmiConfig } from "$lib/wagmi";
import type { IGunUserInstance } from "gun/types";
import { auth, leave, useUser, isPair } from "./user";
import { SEA, useGun } from "$lib/gun/gun";

import { browser } from "$app/environment";

export const MESSAGE_TO_SIGN = "Accesso a GunDB con Ethereum";

const gunInstance = useGun();

const { user } = useUser();


export function initializeAuth() {
  gunInstance.user().recall({ sessionStorage: true }, async ack => {
    if ("err" in ack) {
      console.error("Errore nel recupero della sessione:", ack.err);
    } else if (user.is && user.is.alias) {
      await loadUserData(user);
    }
  });

  gunInstance.user().on("auth", async () => {
    console.log("Utente autenticato:", user.is.alias as string);
    await loadUserData(user);
  });

  return gunInstance.user();
}

async function loadUserData(user: IGunUserInstance) {
  console.log("Caricamento dati utente...");
  const gunInstance = useGun();
  const account = getAccount(wagmiConfig);

  if (user.is && user.is.alias) {
    const signature = await gunInstance.createSignature(MESSAGE_TO_SIGN);
    const userPair = await gunInstance.getAndDecryptPair(account.address, signature);
    console.log("Coppia utente:", userPair);
  }
}

export async function signIn(): Promise<string | null> {
  console.log("Registrazione in corso...");
  
  const gunInstance = useGun();
  const account = getAccount(wagmiConfig);

  try {
    if (!account.isConnected) {
      return "Per favore connetti il tuo portafoglio Ethereum";
    }

    const signature = await gunInstance.createSignature(MESSAGE_TO_SIGN);

    if (!signature) {
      return "Errore durante la firma del messaggio";
    }

    // Verifica se esiste già un encrypted pair per questo utente
    const existingPair = await gunInstance.get(`~${account.address}`).get("safe").get("enc").then();
    const remoteKeyPair = gunInstance.get("gun-eth").get("users").get(account.address).get("pair");
    
    if (existingPair || remoteKeyPair) {
      console.log("Encrypted pair esistente trovato. Esecuzione del login...");
      await gunInstance.get(`~${account.address}`).get("safe").get("enc").put(remoteKeyPair);
      return login(signature);
    }

    let pair = await gunInstance.createAndStoreEncryptedPair(account.address, signature);
    console.log("Pair:", pair);

    return new Promise(resolve => {
      gunInstance.user().create(account.address, signature, async (ack: { ok: 0; pub: string } | { err: string }) => {
        if ("err" in ack) {
          resolve("Error during registration: " + ack.err);
        } else {
          await loadUserData(user);
          await auth(pair, async (ack: { err: string }) => {
            console.log("Risposta di autenticazione:", ack);
            if (ack.err) {
              console.error("Errore di accesso: " + ack.err);
            } else {
              console.log("Accesso riuscito");
              const { user } = useUser();
              user.update(u => ({ ...u, auth: true, pub: gunInstance.user().is.alias }));
              console.log("User:", get(user));
            }
          });
          resolve(null);
        }
      });
    });
  } catch (error) {
    return "Errore durante la registrazione: " + error.message;
  }
}

export async function login(sig?: string): Promise<string | null> {
  const account = getAccount(wagmiConfig);

  if (!account.isConnected) {
    notification.error("Nessun account Ethereum connesso");
    return "Nessun account Ethereum connesso";
  }

  console.log("Accesso in corso...");
  const gunInstance = useGun()
  try {
    if (!account.address) {
      return "Nessun account Ethereum connesso";
    }

    const signature = sig ? sig : await gunInstance.createSignature(MESSAGE_TO_SIGN);
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
        user.update(u => ({ ...u, auth: true, pub: gunInstance.user().is.alias }));
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

/**
 * @typedef {Object} Safe
 * @property {boolean} saved - Whether data is saved
 * @property {string} password - Stored password
 * @property {string} enc - Encrypted data
 * @property {string} pass - Stored pass
 * @property {Object} rooms - Room information
 */

/**
 * @typedef {Object} Auth
 * @property {string} input - User input for password
 * @property {boolean} show - Whether to show password
 * @property {boolean} safePair - Indicates if the pair is safe
 * @property {number} minLength - Minimum length for password
 * @property {Safe} safe - Safe storage object
 * @property {Object} dec - Decrypted data object
 * @property {string} [dec.pass] - Decrypted password
 * @property {Object} [dec.pair] - Decrypted key pair
 * @property {Object} links - Link generation object
 * @property {string} links.pass - Generated pass link
 * @property {string} links.pair - Generated pair link
 * @property {function(): void} set - Function to set password
 */

interface Auth {
  input: string;
  show: boolean;
  safePair: boolean;
  minLength: number;
  safe: {
    saved: boolean;
    password: string;
    enc: string;
    pass: string;
    rooms: Record<string, any>;
  };
  dec: Record<string, any>;
  links: {
    pass: string;
    pair: string;
  };
  set: () => void;
}

export const pass = writable<Auth>({
  input: "",
  show: false,
  safePair: false,
  minLength: 5,
  safe: {
    saved: false,
    password: "",
    enc: "",
    pass: "",
    rooms: {},
  },
  dec: {},
  links: {
    pass: "",
    pair: "",
  },
  set: () => {},
});


// Derived stores for links
const passLink = derived([pass], ([$pass]) => genLink($pass.safe?.enc));
const pairLink = derived([user], ([$user]) => genLink(JSON.stringify(user.pair)));

// Update links in the pass store
pass.update(p => ({
  ...p,
  links: {
    pass: get(passLink),
    pair: get(pairLink),
  },
}));

function genLink(text = "", auth_url = "#/auth/") {
  if (browser) {
    let base = encodeURIComponent(text);

    return window.location.origin + window.location.pathname + auth_url + base;
}
}

export function parseLink(link: string, auth_url = "#/auth/") {
  let index = link.indexOf(auth_url);
  let base = link.substring(index + auth_url.length);
  return decodeURIComponent(base);
}

let initiated = false;

export function useAuth() {
  if (!initiated) {
    const gunInstance = useGun();
    gunInstance
      .user()
      .get("safe")
      .map()
      .on((d, k) => {
        pass.update(p => ({
          ...p,
          safe: { ...p.safe, [k]: d },
        }));
      });

    // Svelte equivalent of watchEffect
    pass.subscribe(async $pass => {
      if (!$pass.show) {
        pass.update(p => ({ ...p, dec: {} }));
        return;
      }
      if ($pass?.safe?.pass) {
        const decPass = await get(user).decrypt($pass.safe.pass);
        pass.update(p => ({
          ...p,
          dec: { ...p.dec, pass: decPass },
          input: decPass || "",
        }));
      }
      if ($pass?.safe?.enc) {
        const decPair = await SEA.decrypt($pass.safe.enc, $pass.dec.pass);
        pass.update(p => ({
          ...p,
          dec: { ...p.dec, pair: decPair },
        }));
      }
    });
  }
  initiated = true;
  return { pass, setPass, authWithPass };
}

export async function hasPass(pub: string) {
  const gunInstance = useGun();
  return await gunInstance.get(`~${pub}`).get("safe").get("enc").then();
}

async function authWithPass(pub: string, passphrase: string) {
  const gunInstance = useGun();
  let encPair = await gunInstance.get(`~${pub}`).get("safe").get("enc").then();
  let pair = await SEA.decrypt(encPair, passphrase);
  auth(pair);
}

async function setPass(text: string) {
  const gunInstance = useGun();
  let encPair = await SEA.encrypt(get(user).pair(), text);
  let encPass = await get(user).encrypt(text);
  gunInstance.user().get("safe").get("enc").put(encPair);
  gunInstance.user().get("safe").get("pass").put(encPass);
}

export function useAuthLink(data: string, passPhrase: string) {
  if (!data) return;
  const decoded = decodeURIComponent(data);
  console.log("dec", decoded);
  if (decoded.substring(0, 3) == "SEA") {
    if (passPhrase) {
      authEncPass(decoded, passPhrase);
    }
    return "encrypted";
  } else {
    try {
      let d = JSON.parse(decoded);
      if (isPair(d)) {
        auth(d);
      }
      return "success";
    } catch (e) {
      return "incorrect link";
    }
  }
}

async function authEncPass(encPair: string, passphrase: string) {
  let pair = await SEA.decrypt(encPair, passphrase);
  auth(pair);
}
