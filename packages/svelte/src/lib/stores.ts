import type { IGunInstance } from "gun";
import { writable, type Writable } from "svelte/store";

export const currentUser = writable(null);
export const gun = writable(null) as unknown as Writable<IGunInstance<any>>;


