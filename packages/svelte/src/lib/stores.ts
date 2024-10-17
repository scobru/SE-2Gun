import type { IGunInstance } from "gun";
import { writable, type Writable } from "svelte/store";

import Gun from "gun";
import "gun/lib/then";
import "gun/lib/radix";
import "gun/lib/radisk";
import "gun/lib/store";
import "gun/lib/rindexed";
import "gun/lib/webrtc";
import "gun-eth";
import "gun/lib/yson.js";

import { peers } from "../../gun.config";

export const currentUser = writable(null);

export const gun = writable(null) as unknown as Writable<IGunInstance<any>>;

const gunInstance: IGunInstance<any> = new Gun(peers[0]);

gun.set(gunInstance);
