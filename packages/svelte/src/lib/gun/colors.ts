/**
 * Deterministic colors derived from pub keys, hashes or any other string data
 * @module Color
 * @group UI
 * */

import { browser } from '$app/environment';

let ColorHash: any;

if (browser) {
  ColorHash = (await import('color-hash')).default;
}

/**
 * @typedef {'light' | 'regular' | 'deep' | 'dark'} Palette
 */

const color: Record<string, any> = {};

if (browser) {
  color.light = new ColorHash({
    saturation: [0.05, 0.08, 0.22],
    lightness: [0.85, 0.87, 0.9],
  });
  color.pale = new ColorHash({
    saturation: [0.05, 0.42, 0.52],
    lightness: [0.75, 0.77, 0.9],
  });
  color.regular = new ColorHash({
    saturation: [0.1, 0.5, 0.7],
    lightness: [0.3, 0.5, 0.7],
  });
  color.deep = new ColorHash({
    saturation: [0.5, 0.6, 0.7],
    lightness: [0.2, 0.35, 0.4],
  });
  color.dark = new ColorHash({
    saturation: [0.02, 0.5, 0.6],
    lightness: [0.18, 0.2, 0.5],
  });
}

/**
 * Get a color generator of a certain palette
 * @param {Palette} [palette='deep']
 * @returns {ColorHash} Color-Hash instance
 * @see https://github.com/zenozeng/color-hash
 * @example
 * import {useColor} from '@gun-vue/composables'
 * const colorDeep = useColor('deep')
 * const color = colorDeep.hex('any text data')
 * // color == '#e052ae'
 */
export function useColor(palette = "deep") {
  if (!browser) {
    return {
      hex: () => '#000000', // Fallback color for SSR
    };
  }
  
  if (typeof palette == "object") {
    return new ColorHash(palette);
  }
  return color[palette as keyof typeof color];
}