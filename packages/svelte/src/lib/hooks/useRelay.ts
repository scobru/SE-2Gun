/**
 * Relay connection management
 * @module Relay
 * @group Database
 */

import { useGun } from "./useGun";
import { derived, writable, get } from "svelte/store";
import ms from "ms";

import config from "../../../gun.config.json";
import { browser } from "$app/environment";

const defaultPeer = config.relay;

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
    if (!browser) return
    
    const { subscribe, set, update } = writable({
        list: [],
        peer: localStorage.getItem("peer") || defaultPeer,
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

    return {
        subscribe,
        set,
        update,
        setPeer: (url) => {
            update(r => {
                r.peer = url;
                localStorage.setItem("peer", url);
                return r;
            });
            setTimeout(() => {
                window.location.reload();
            }, 700);
        },
        resetPeer: () => {
            update(r => {
                r.peer = defaultPeer;
                localStorage.setItem("peer", defaultPeer);
                return r;
            });
            setTimeout(() => {
                window.location.reload();
            }, 700);
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
    if (prevPulse !== 0 && $relay.pulse !== prevPulse) {
        relay.update(r => {
            r.blink = !r.blink;
            r.lag = $relay.pulse - prevPulse - 500;
            return r;
        });
    }
    prevPulse = $relay.pulse;
});

/**
 * Peer server status monitor
 * @returns {{relay: Writable<Relay>, setPeer: (url: string) => void, resetPeer: () => void}}
 */
export function useRelay() {
    const gun = useGun();
    const $relay = get(relay);
    if ($relay.pulse === 0 && get(hostname)) {
        gun
            .get(get(hostname))
            .map()
            .on((d, k) => {
                try {
                    relay.update(r => {
                        r[k] = d;
                        return r;
                    });
                } catch (e) {
                    console.log(e);
                }
            });
    }

    return { relay, setPeer: relay.setPeer, resetPeer: relay.resetPeer };
}