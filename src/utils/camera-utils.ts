/**
 * Camera utility functions for smooth interpolation and coordinate transformations
 */

/**
 * Linear interpolation between two values
 * @param a - Start value
 * @param b - End value
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated value
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Clamp a value between min and max
 * @param value - Value to clamp
 * @param min - Minimum bound
 * @param max - Maximum bound
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Smooth step interpolation for smoother transitions
 * @param edge0 - Lower edge
 * @param edge1 - Upper edge
 * @param x - Value to interpolate
 * @returns Smoothed value
 */
export function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Convert world coordinates to screen coordinates
 * @param worldX - World X position
 * @param worldY - World Y position
 * @param cameraX - Camera X position
 * @param cameraY - Camera Y position
 * @param zoom - Camera zoom level
 * @returns Screen coordinates
 */
export function worldToScreen(
  worldX: number,
  worldY: number,
  cameraX: number,
  cameraY: number,
  zoom: number
): { x: number; y: number } {
  return {
    x: (worldX - cameraX) * zoom,
    y: (worldY - cameraY) * zoom,
  };
}

/**
 * Convert screen coordinates to world coordinates
 * @param screenX - Screen X position
 * @param screenY - Screen Y position
 * @param cameraX - Camera X position
 * @param cameraY - Camera Y position
 * @param zoom - Camera zoom level
 * @returns World coordinates
 */
export function screenToWorld(
  screenX: number,
  screenY: number,
  cameraX: number,
  cameraY: number,
  zoom: number
): { x: number; y: number } {
  return {
    x: screenX / zoom + cameraX,
    y: screenY / zoom + cameraY,
  };
}
