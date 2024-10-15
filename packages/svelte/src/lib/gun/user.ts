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
import { debounce } from "lodash-es";

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
  color: "",
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
      const { user } = useUser();
      user.update(u => ({ ...u, auth: true }));
      console.log("Successo autenticazione");
      cb(ack);
    }
  });
}

function init() {
  const gun = useGun();
  user.update(u => ({ ...u, is: gun.user().is, db: gun.user() }));

  if (get(user).pulser) {
    clearInterval(get(user).pulser);
  }

  const pulser = setInterval(() => {
    gun.user().get("pulse").put(Date.now());
  }, 1000);

  gun.user().get("epub").put(get(user).is.epub);

  gun.user().get("pulse").on((d) => {
    user.update(u => ({ ...u, blink: !u.blink, pulse: d }));
  });

  gun.user().get("safe").map().on((d, k) => {
    user.update(u => ({ ...u, safe: { ...u.safe, [k]: d } }));
  });

  gun.user().get("profile").get("name").on((d) => {
    user.update(u => ({ ...u, name: d }));
  });

  user.update(u => ({ ...u, pulser, initiated: true }));
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
 * Update a profile field
 * @param {string} field - Field name
 * @param {string} data - Field value
 * @example
 * import { updateProfile } from '@gun-vue/composables'
 *
 * updateProfile('city', 'Bangkok')
 */
export const updateProfile = debounce((field: string, data: string) => {
  if (field && data !== undefined) {
    const gun = useGun();
    gun.user().get("profile").get(field).put(data);
  }
}, 300);

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

  if (userStore?.is && userStore?.is?.pub) {
    gun.user().get("profile").map().on((data, key) => {
      if (data !== null && data !== undefined && key !== "_" && key !== "#" && key !== ">") {
        user.update(u => ({
          ...u,
          profile: { ...u.profile, [key]: data }
        }));
      }
    });
  }
}

export function addProfileField(title: string) {
  const gun = useGun();
  gun.user().get("profile").get(title).put("");
}

export function updateProfileField(field: string, value: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const gun = useGun();
    console.log(`Tentativo di aggiornamento del campo '${field}' con valore:`, value);
    gun
      .user()
      .get("profile")
      .get(field)
      .put(value, async (ack: { err: any }) => {
        if (ack.err) {
          console.error("Errore nell'aggiornamento del campo del profilo:", ack.err);
          reject(new Error(ack.err));
        } else {
          console.log(`Campo '${field}' aggiornato con successo in Gun`);
          user.update(u => {
            const updatedProfile = { ...u.profile, [field]: value };
            console.log("Profilo aggiornato localmente:", updatedProfile);
            return { ...u, profile: updatedProfile };
          });
          resolve();
        }
      })
      .once();
  });
}

export function removeProfileField(field: string) {
  const gun = useGun();
  gun
    .user()
    .get("profile")
    .get(field)
    .put(null, ack => {
      if (ack.err) {
        console.error("Error removing profile field:", ack.err);
      } else {
        user.update(u => {
          const updatedProfile = { ...u.profile };
          delete updatedProfile[field];
          return { ...u, profile: updatedProfile };
        });
      }
    });
}

/**
 * Salva l'intero profilo utente
 * @param {Object} profile - Oggetto profilo completo
 */
export function saveUserProfile(profile: { [s: string]: unknown } | ArrayLike<unknown>) {
  const gun = useGun();
  console.log(" di salvataggio dell'intero profilo:", profile);
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
          user.update(u => ({
            ...u,
            profile: { ...u.profile, [key]: value },
          }));
        }
      });
  });
  // Aggiorna lo store locale
  user.update(u => ({ ...u, profile }));
  console.log("Store utente aggiornato con l'intero profilo");
}