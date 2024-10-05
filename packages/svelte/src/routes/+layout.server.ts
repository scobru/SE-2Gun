import { dev } from '$app/environment';
import { VERCEL_URL } from '$env/static/private';
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = () => {
  return {
    vercelUrl: dev ? undefined : VERCEL_URL,
  };
};
