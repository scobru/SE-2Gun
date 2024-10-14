/**
 * [[include:./user/README.md]]
 *
 * ## <UserIcon />
 * <UserIcon />
 * @module User
 * @group Users
 */

import SEA from "gun/sea";
import { useGun } from "./gun";
import { writable, derived, get } from "svelte/store";

/**
 * @type {{ pub: string }}
 */
export const selectedUser = writable({
  pub: "",
});

/**
 * @typedef {Object} User
 * @property {boolean} initiated
 * @property {boolean} auth
 * @property {Object} is
 * @property {string} [is.pub]
 * @property {string} [is.epub]
 * @property {string|Object} [is.alias]
 * @property {string} name
 * @property {string} pub
 * @property {string} color
 * @property {number} pulse
 * @property {any} pulser
 * @property {boolean} blink
 * @property {Object} safe
 * @property {boolean} safe.saved
 * @property {string} safe.password
 * @property {string} safe.enc
 * @property {string} safe.pass
 * @property {Object} safe.rooms
 * @property {Object} [db]
 * @property {function(): Object} pair
 * @property {function(string): Promise<string>} encrypt
 * @property {function(string): Promise<string>} decrypt
 * @property {function(string): Promise<string>} secret
 */

/** @type {User} */
export const user = writable({
  initiated: false,
  auth: false,
  is: null,
  name: "",
  pub: "",
  pulse: 0,
  pulser: null,
  blink: false,
  safe: {
    saved: false,
    password: "",
    enc: "",
    pass: "",
    rooms: {},
  },
  db: undefined,
  profile: {},
  pair() {
    console.warn("User pair read externally");
    return pair();
  },
  async encrypt(data: string) {
    return await SEA.encrypt(data, pair());
  },
  async decrypt(data: string) {
    return await SEA.decrypt(data, pair());
  },
  async secret(data: string | { epub: string }) {
    return await SEA.secret(data, pair());
  },
});

// Creiamo un derived store per 'pub'
export const userPub = derived(user, $user => $user.pub || "");

let pairReads = 0;

/**
 * @returns {Object}
 */
function pair() {
  console.log("User pair read", ++pairReads);
  const gun = useGun();
  return gun.user()?._?.sea;
}

/**
 * Get access to current logged in user
 * @returns {{user: User, auth: Function, leave: Function}}
 * @example
 * import { useUser } from '@gun-vue/composables'
 *
 * const { user, auth, leave } = useUser()
 */
export function useUser() {
  if (!get(user).initiated) {
    const gun = useGun();
    gun.user().recall({ sessionStorage: true }, () => {
      console.log("User recalled");
      if (gun.user().is) {
        init();
      }
    });

    gun.on("auth", () => {
      init();
      console.log("User authenticated");
    });
    user.update(u => ({ ...u, initiated: true }));
  }

  return { user };
}

/**
 * Authenticate with a SEA key pair
 * @param {Object} pair - SEA key pair
 * @param {Function} [cb] - Callback function
 * @example
 * import { auth, SEA } from '@gun-vue/composables'
 *
 * async function login() {
 *    const pair = await SEA.pair()
 *    auth(pair)
 * }
 */

export async function auth(pair: any, cb = (pair: any) => {}) {
  const gun = useGun();

  if (!isPair(pair)) {
    console.log("incorrect pair", pair);
    return;
  }

  gun.user().auth(pair, async (ack: { err: any }) => {
    if (ack.err) {
      console.error("Errore di autenticazione:", ack.err);
      cb(ack);
    } else {
      init();
      const { user } = useUser();
      user.update(u => ({ ...u, auth: true }));
      console.log("Successo autenticazione");
      cb(ack);
    }
  });
}

function init() {
  const gun = useGun();
  const pub = gun.user().is?.pub;
  user.update(u => ({ ...u, db: gun.user(), is: gun.user().is, pub: pub }));
  loadUserProfile(); // Carica il profilo dopo l'inizializzazione
  console.log("User initialized:", get(user));
}

/**
 * Log out the user
 * @example
 * import { leave } from '@gun-vue/composables'
 *
 * leave()
 **/
export function leave() {
  console.log("User logout");
  const gun = useGun();
  const userValue = get(user);
  const is = !!userValue?.is;
  user.update(u => ({ ...u, initiated: false, auth: false }));
  if (userValue.pulser) {
    clearInterval(userValue.pulser);
  }
  gun.user().leave();
  setTimeout(() => {
    if (is && !pair()) {
      user.update(u => ({ ...u, is: null }));
      console.info("User logged out");
    }
  }, 500);
}

/**
 * Check if the soul belongs to the current user
 * @param {string} soul
 * @returns {boolean}
 */
export function isMine(soul: string | any[]) {
  if (!soul) return;
  return soul.slice(1, 88) == user.pub;
}

/**
 * Add a field to the User profile
 * @param {string} title - Field title
 * @example
 * import { addProfileField } from '@gun-vue/composables'
 *
 * addProfileField('city')
 */
export function addProfileField(title: any) {
  const gun = useGun();
  gun.user().get("profile").get(title).put("");
}

/**
 * Update a profile field
 * @param {string} field - Field name
 * @param {string} data - Field value
 * @example
 * import { updateProfile } from '@gun-vue/composables'
 *
 * updateProfile('city', 'Bangkok')
 */
export function updateProfile(field: any, data: undefined) {
  if (field && data !== undefined) {
    const gun = useGun();
    gun.user().get("profile").get(field).put(data);
  }
}

export function removeProfileField(field: any) {
  const gun = useGun();
  gun.user().get("profile").get(field).put(null);
}

/**
 * Check if the object is a proper SEA pair
 * @param {Object} pair
 * @returns {boolean}
 */
export function isPair(pair: { pub: any; epub: any; priv: any; epriv: any }) {
  return Boolean(pair && typeof pair == "object" && pair.pub && pair.epub && pair.priv && pair.epriv);
}

/**
 * Carica il profilo dell'utente da Gun
 */
export function loadUserProfile() {
  const gun = useGun();
  const userStore = get(user);

  console.log("Loading user profile");

  if (userStore?.is && userStore?.is?.pub) {
    gun
      .user()
      .get("profile")
      .on((data: { name: any; email: any; bio: any }) => {
        console.log("Profile data received:", data);
        if (data) {
          const filteredProfile = {
            name: data.name || "",
            email: data.email || "",
            bio: data.bio || "",
          };
          user.update(u => {
            console.log("Updating user store with profile:", filteredProfile);
            return { ...u, profile: filteredProfile };
          });
        } else {
          console.log("No profile data received");
        }
      });
  } else {
    console.log("User not authenticated or pub not available");
  }
}
/**
 * Aggiorna un campo del profilo utente
 * @param {string} field - Nome del campo
 * @param {any} value - Valore del campo
 */
export function updateProfileField(field: string, value: any) {
  const gun = useGun();
  if (value !== undefined) {
    gun
      .user()
      .get("profile")
      .get(field)
      .put(value, (ack: { err: any }) => {
        if (ack.err) {
          console.error(`Errore nell'aggiornamento del campo ${field}:`, ack.err);
        } else {
          console.log(`Campo ${field} aggiornato con successo`);
          user.update(u => ({
            ...u,
            profile: { ...u.profile, [field]: value },
          }));
        }
      });
  } else {
    console.warn(`Tentativo di aggiornare ${field} con un valore undefined`);
  }
}

/**
 * Salva l'intero profilo utente
 * @param {Object} profile - Oggetto profilo completo
 */
export function saveUserProfile(profile: { [s: string]: unknown } | ArrayLike<unknown>) {
  const gun = useGun();
  Object.entries(profile).forEach(([key, value]) => {
    gun
      .user()
      .get("profile")
      .get(key)
      .put(value, (ack: { err: any }) => {
        if (ack.err) {
          console.error(`Errore nel salvataggio del campo ${key}:`, ack.err);
        } else {
          console.log(`Campo ${key} salvato con successo`);
        }
      });
  });
  // Aggiorna lo store locale
  user.update(u => ({ ...u, profile }));
}
