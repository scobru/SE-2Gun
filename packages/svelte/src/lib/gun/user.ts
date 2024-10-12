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
  pair() {
    console.warn("User pair read externally");
    return pair();
  },
  async encrypt(data) {
    return await SEA.encrypt(data, pair());
  },
  async decrypt(data) {
    return await SEA.decrypt(data, pair());
  },
  async secret(data) {
    return await SEA.secret(data, pair());
  },
});

// Creiamo un derived store per 'pub'
export const userPub = derived(user, $user => $user.is?.pub || "");

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
    user.update(u => ({ ...u, db: gun.user(), is: "" }));
    gun.user().recall({ sessionStorage: true }, () => {
      console.log("user was recalled");
    });

    gun.on("auth", () => {
      init();
      console.log("user authenticated");
    });
    user.update(u => ({ ...u, initiated: true }));
  }

  return { user, auth, leave };
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

export async function auth(pair, cb = pair => {}) {
  const gun = useGun();
  if (!isPair(pair)) {
    console.log("incorrect pair", pair);
    return;
  }
  gun.user().auth(pair, async ack => {
    if (ack.err) {
      console.error("Errore di autenticazione:", ack.err);
      cb(ack);
    } else {
      init();
      console.log("user is authenticated");
      const { user } = useUser();
      user.update(u => ({ ...u, auth: true }));
      console.log("User:", user);
      cb(ack);
    }
  });
}

async function init() {
  const gun = useGun();
  return new Promise(resolve => {
    gun.on("auth", () => {
      user.update(u => ({ ...u, is: gun.user().is }));
      if (user.pulser) {
        clearInterval(user.pulser);
      }
      user.update(u => ({
        ...u,
        pulser: setInterval(() => {
          gun.user().get("pulse").put(Date.now());
        }, 1000),
      }));

      gun.user().get("epub").put(user.is.epub);

      gun
        .user()
        .get("pulse")
        .on(d => {
          user.update(u => ({ ...u, blink: !u.blink, pulse: d }));
        });

      gun
        .user()
        .get("safe")
        .map()
        .on((d, k) => {
          user.update(u => ({ ...u, safe: { ...u.safe, [k]: d } }));
        });

      gun
        .user()
        .get("profile")
        .get("name")
        .on(d => {
          user.update(u => ({ ...u, name: d }));
        });

      user.update(u => ({ ...u, initiated: true }));
      resolve();
    });
  });
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
  let is = !!user.is?.pub;
  user.update(u => ({ ...u, initiated: false, auth: false }));
  clearInterval(user.pulser);
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
export function isMine(soul) {
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
export function addProfileField(title) {
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
export function updateProfile(field, data) {
  if (field && data !== undefined) {
    const gun = useGun();
    gun.user().get("profile").get(field).put(data);
  }
}

/**
 * Check if the object is a proper SEA pair
 * @param {Object} pair
 * @returns {boolean}
 */
export function isPair(pair) {
  return Boolean(pair && typeof pair == "object" && pair.pub && pair.epub && pair.priv && pair.epriv);
}
