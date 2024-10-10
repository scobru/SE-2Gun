import type { IGunInstance } from "gun";
import { writable, type Writable } from "svelte/store";
import { browser } from '$app/environment';
import Gun from 'gun';
import "gun-eth";
import { useGun } from "./hooks/useGun";

export const currentUser = writable(null);
export const gun = writable(null) as unknown as Writable<IGunInstance<any>>;

let gunInstance = useGun();

gun.set(gunInstance);

Gun.on('opt', function (ctx) {
    if (ctx.once) {
        return
    }
    ctx.on('out', function (msg) {
        var to = this.to
        // Adds headers for put
        msg.headers = {
            token: 'test'
        }
        to.next(msg) // pass to next middleware
    })
})
