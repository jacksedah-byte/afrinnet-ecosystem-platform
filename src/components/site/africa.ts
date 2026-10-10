/**
 * Stylised continental geometry used by the hero visual and the map.
 *
 * This is a deliberately abstract silhouette for decorative/diagrammatic use —
 * it is not a survey-grade map and must not be used to imply geographic
 * coverage or the location of institutions.
 */

export const AFRICA_VIEWBOX = "0 0 420 500";

const OUTLINE: [number, number][] = [
  [126, 64],
  [206, 50],
  [258, 68],
  [294, 90],
  [308, 124],
  [342, 146],
  [382, 176],
  [348, 220],
  [330, 272],
  [308, 330],
  [282, 390],
  [246, 446],
  [202, 468],
  [162, 452],
  [134, 404],
  [116, 344],
  [126, 304],
  [108, 272],
  [76, 260],
  [40, 254],
  [16, 228],
  [24, 184],
  [50, 154],
  [78, 118],
];

export const AFRICA_PATH =
  OUTLINE.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ") + " Z";

export const OUTLINE_POINTS = OUTLINE;

export const MADAGASCAR_PATH =
  "M352 336 C364 344 372 368 368 392 C364 412 352 418 346 408 C340 394 342 360 352 336 Z";

/** Abstract innovation nodes (decorative — not institutional locations). */
export const NETWORK_NODES: [number, number][] = [
  [86, 140],
  [160, 96],
  [238, 90],
  [276, 140],
  [300, 178],
  [56, 206],
  [124, 196],
  [196, 172],
  [264, 214],
  [96, 254],
  [170, 244],
  [240, 266],
  [300, 300],
  [148, 302],
  [216, 318],
  [118, 336],
  [176, 372],
  [232, 406],
  [196, 440],
  [42, 230],
];

/** Connections between nodes — a mix of short links and a few "spine" links. */
export const NETWORK_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 6],
  [6, 7],
  [7, 2],
  [5, 6],
  [5, 19],
  [19, 9],
  [9, 10],
  [10, 7],
  [10, 11],
  [11, 8],
  [8, 4],
  [11, 14],
  [14, 12],
  [12, 8],
  [13, 10],
  [13, 15],
  [15, 16],
  [16, 17],
  [17, 14],
  [17, 18],
  [18, 16],
  [1, 10],
  [4, 12],
  [0, 5],
];

/** Edges that carry a travelling light pulse (keep this list short). */
export const PULSE_EDGES: [number, number][] = [
  [1, 10],
  [9, 10],
  [10, 11],
  [11, 14],
  [14, 17],
  [6, 7],
];

export function nodeDistance(a: [number, number], b: [number, number]) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}
