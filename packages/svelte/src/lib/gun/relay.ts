/**
 * Relay connection management
 * @module Relay
 * @group Database
 */

import { useGun } from "$lib/gun/gun";
import { derived, writable, get } from "svelte/store";
import { browser } from "$app/environment";
import ms from "ms";

import {peers} from "../../../gun.config"
import { gun } from "$lib/stores";

const defaultPeer = peers[0];

/**
 * Peer server status reactive object
 * @typedef {Object} Relay
 * @property {string} peer
 * @property {string} hostname
 * @property {string} status
 * @property {number} pulse
 * @property {number} lag
 * @property {number} started
 * @property {number} diff
 * @property {string} age
 * @property {boolean} blink
 */

function createRelay() {
  const store = writable({
    list: [],
    peer: browser ? localStorage.getItem("peer") || defaultPeer : defaultPeer,
    hostname: "",
    status: "offline",
    started: 0,
    pulse: 0,
    lag: 0,
    diff: 0,
    age: "",
    delay: 0,
    blink: false
  });

  const { subscribe, update } = store;

  return {
    subscribe,
    setPeer: (url: string) => {
      update(r => {
        console.log(r)
        r.peer = url;
        if (browser) localStorage.setItem("peer", url);
        setTimeout(() => {
          console.log(get(gun))
          // set new peer on gunDB on opt
          console.log(get(gun).opt({peers: []}))
          get(gun).opt({peers: [url]});
          //window.location.reload();
        }, 700);
        return r;
      });
    },
    resetPeer: () => {
      update(r => {
        r.peer = defaultPeer;
        if (browser) localStorage.setItem("peer", defaultPeer);
        setTimeout(() => {
          //window.location.reload();
        }, 700);
        return r;
      });
    },
    updateField: (key: string, value: any) => {
      update(r => ({ ...r, [key]: value }));
    }
  };
}

export const relay = createRelay();

// Derived stores
export const hostname = derived(relay, $relay => new URL($relay.peer)?.hostname || "");
export const diff = derived(relay, $relay => $relay.pulse - $relay.started);
export const age = derived(diff, $diff => ms($diff));
export const delay = derived(relay, $relay => Date.now() - $relay.pulse);

// Watch for pulse changes
let prevPulse = 0;
relay.subscribe($relay => {
  if (prevPulse && $relay.pulse !== prevPulse) {
    relay.updateField("blink", !$relay.blink);
    relay.updateField("lag", $relay.pulse - prevPulse - 500);
  }
  prevPulse = $relay.pulse;
});

/**
 * Peer server status monitor
 * @returns {{relay: Writable<Relay>, setPeer: (url: string) => void, resetPeer: () => void}}
 */
export function useRelay() {
  if (browser) {
  const gun = useGun();
  const $relay = get(relay);
  
  if ($relay.pulse === 0 && hostname) {
    gun
      .get(get(hostname))
      .map()
      .on((d, k) => {
        try {
          relay.updateField(k, d);
        } catch (e) {
          console.log(e);
        }
      });
  }
}

  return { relay, setPeer: relay.setPeer, resetPeer: relay.resetPeer };
}