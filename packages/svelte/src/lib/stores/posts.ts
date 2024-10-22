/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import { useGun } from "$lib/gun/gun";
import { SEA } from "$lib/gun/gun";
import type { IGunChain } from "gun/types";
import { writable } from "svelte/store";

import { validToken } from "../../../gun.config";

const db = useGun();


const dbPosts = db.get('gun-eth').get('posts');

export type PostType = {
  text: string;
  author: string;
  pub: string;
  date: number;
  id?: string;
}

type PostStore = {
  [x: string]: PostType;
}

const encryptPost = async (post: PostType) => {
  const text = await SEA.encrypt(post.text, validToken as string);
  return { ...post, text };
};

const decryptPost = async (post: PostType) => {
  const text = await SEA.decrypt(post.text, validToken as string);
  return { ...post, text };
};

const createMapStore = (ref: IGunChain<any, any, false>) => {
  const { update, subscribe } = writable<PostStore>({});
  ref.on(async (data, key) => {
    try {
      if (!data) {
        update(store => {
          const newStore = { ...store };
          delete newStore[key];
          return newStore;
        });
        return;
      }

      const post = await decryptPost(data);
      update(store => ({...store, [key]: post}));
    } catch (error) {
      console.error("Errore nell'aggiornamento dello store:", error);
    }
  });

  return {
    subscribe,
    update: async (key: string, post: PostType) => {
      const encrypted = await encryptPost(post);
      return dbPosts.get(key).put(encrypted);
    }
  };
};

const postsRef = dbPosts.map();
export const postStore = createMapStore(postsRef);
