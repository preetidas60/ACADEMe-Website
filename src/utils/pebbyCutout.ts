/**
 * Pure flood-fill background cutout for Pebby's 3D master PNG.
 * Removes ONLY exterior border-connected dark-navy background pixels while
 * keeping interior dark features (eyes, eyebrows, mouth inside the white face)
 * 100% opaque, with anti-aliased edge feathering and color decontamination.
 */

export const PEBBY_MASTER_SRC = '/assets/aistudio/pebby_3d_master_0460858d.png';

export interface OpaqueBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

export interface CutoutOptions {
  hardThreshold?: number;
  softThreshold?: number;
}

/**
 * Flood-fills from all outer border pixels matching the corner background color,
 * making exterior background transparent and cleanly feathering/decontaminating
 * the 1–2px anti-aliased boundary around the mascot silhouette.
 */
export function removeExteriorBackground(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  options: CutoutOptions = {}
): Uint8ClampedArray {
  const hardThreshold = options.hardThreshold ?? 44;
  const softThreshold = options.softThreshold ?? 102;
  const totalPixels = width * height;

  if (totalPixels === 0) return data;

  // Sample 4 corners to get accurate exterior background RGB
  const sampleCoords = [
    0,
    width - 1,
    (height - 1) * width,
    height * width - 1,
  ];
  let bgR = 0;
  let bgG = 0;
  let bgB = 0;
  for (const idx of sampleCoords) {
    const o = idx * 4;
    bgR += data[o];
    bgG += data[o + 1];
    bgB += data[o + 2];
  }
  bgR /= sampleCoords.length;
  bgG /= sampleCoords.length;
  bgB /= sampleCoords.length;

  const colorDist = (pixelIdx: number): number => {
    const o = pixelIdx * 4;
    const dr = data[o] - bgR;
    const dg = data[o + 1] - bgG;
    const db = data[o + 2] - bgB;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };

  // BFS queue for border-connected exterior background pixels
  const visited = new Uint8Array(totalPixels);
  const exterior = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  let head = 0;
  let tail = 0;

  const tryEnqueue = (idx: number) => {
    if (visited[idx]) return;
    visited[idx] = 1;
    if (colorDist(idx) <= hardThreshold) {
      exterior[idx] = 1;
      queue[tail++] = idx;
    }
  };

  // Seed all 4 border edges
  for (let x = 0; x < width; x++) {
    tryEnqueue(x);
    tryEnqueue((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y++) {
    tryEnqueue(y * width);
    tryEnqueue(y * width + (width - 1));
  }

  // 4-connected BFS flood-fill through exterior background
  while (head < tail) {
    const idx = queue[head++];
    const x = idx % width;
    const y = (idx - x) / width;

    if (x > 0) tryEnqueue(idx - 1);
    if (x + 1 < width) tryEnqueue(idx + 1);
    if (y > 0) tryEnqueue(idx - width);
    if (y + 1 < height) tryEnqueue(idx + width);
  }

  // Pass 1: Clear all confirmed exterior pixels
  for (let i = 0; i < totalPixels; i++) {
    if (exterior[i]) {
      data[i * 4 + 3] = 0;
    }
  }

  // Pass 2: Smooth anti-aliased edge feathering + color decontamination on 2px outer rim
  const rim = new Uint8Array(totalPixels);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      if (exterior[idx]) continue;
      if (
        exterior[idx - 1] ||
        exterior[idx + 1] ||
        exterior[idx - width] ||
        exterior[idx + width] ||
        exterior[idx - width - 1] ||
        exterior[idx - width + 1] ||
        exterior[idx + width - 1] ||
        exterior[idx + width + 1]
      ) {
        rim[idx] = 1;
      }
    }
  }

  // Expand rim 1px inward for ultra-clean soft 3D anti-aliasing
  const rim2 = new Uint8Array(totalPixels);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      if (exterior[idx] || rim[idx]) continue;
      if (rim[idx - 1] || rim[idx + 1] || rim[idx - width] || rim[idx + width]) {
        rim2[idx] = 1;
      }
    }
  }

  const decontaminatePixel = (idx: number, isOuterRim: boolean) => {
    const dist = colorDist(idx);
    if (dist >= softThreshold) return;

    const range = Math.max(1, softThreshold - hardThreshold);
    const rawT = Math.max(0, Math.min(1, (dist - hardThreshold) / range));
    const alphaT = isOuterRim ? rawT * rawT * (3 - 2 * rawT) : Math.min(1, rawT + 0.35);

    const o = idx * 4;
    if (alphaT <= 0.04) {
      data[o + 3] = 0;
      return;
    }

    // Unpremultiply dark navy bleed from semi-transparent edge pixels
    const invA = 1 / Math.max(alphaT, 0.25);
    data[o] = Math.max(0, Math.min(255, Math.round((data[o] - (1 - alphaT) * bgR) * invA)));
    data[o + 1] = Math.max(0, Math.min(255, Math.round((data[o + 1] - (1 - alphaT) * bgG) * invA)));
    data[o + 2] = Math.max(0, Math.min(255, Math.round((data[o + 2] - (1 - alphaT) * bgB) * invA)));
    data[o + 3] = Math.round(alphaT * 255);
  };

  for (let i = 0; i < totalPixels; i++) {
    if (rim[i]) decontaminatePixel(i, true);
    else if (rim2[i]) decontaminatePixel(i, false);
  }

  return data;
}

/**
 * Computes the tight bounding box of non-transparent pixels with an optional margin.
 */
export function computeOpaqueBounds(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  alphaThreshold = 20,
  padding = 8
): OpaqueBounds {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * width;
    for (let x = 0; x < width; x++) {
      const a = data[(rowOffset + x) * 4 + 3];
      if (a > alphaThreshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    return { minX: 0, minY: 0, maxX: width - 1, maxY: height - 1, width, height };
  }

  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(width - 1, maxX + padding);
  maxY = Math.min(height - 1, maxY + padding);

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

let cachedCutoutPromise: Promise<string> | null = null;
let cachedCutoutUrl: string | null = null;

export function getCachedPebbyCutoutSync(): string | null {
  return cachedCutoutUrl;
}

/**
 * Loads PEBBY_MASTER_SRC once in the browser, strips the solid dark-navy exterior
 * background via flood-fill, tightly crops into a centered square transparent PNG
 * data URL, and caches the result for all PebbyMascot instances.
 */
export function loadPebbyTransparentCutout(): Promise<string> {
  if (cachedCutoutUrl) return Promise.resolve(cachedCutoutUrl);
  if (cachedCutoutPromise) return cachedCutoutPromise;

  cachedCutoutPromise = new Promise<string>((resolve) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      resolve(PEBBY_MASTER_SRC);
      return;
    }

    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      try {
        // Work at 640px for fast (~15ms) high-DPI crisp cutout
        const workSize = Math.min(640, img.naturalWidth || 640);
        const workCanvas = document.createElement('canvas');
        workCanvas.width = workSize;
        workCanvas.height = workSize;
        const ctx = workCanvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(PEBBY_MASTER_SRC);
          return;
        }

        ctx.drawImage(img, 0, 0, workSize, workSize);
        const imageData = ctx.getImageData(0, 0, workSize, workSize);
        removeExteriorBackground(imageData.data, workSize, workSize);
        ctx.putImageData(imageData, 0, 0);

        const bounds = computeOpaqueBounds(imageData.data, workSize, workSize, 20, 6);
        const side = Math.max(bounds.width, bounds.height);
        const outCanvas = document.createElement('canvas');
        outCanvas.width = side;
        outCanvas.height = side;
        const outCtx = outCanvas.getContext('2d');
        if (!outCtx) {
          resolve(PEBBY_MASTER_SRC);
          return;
        }

        const dx = Math.round((side - bounds.width) / 2);
        const dy = Math.round((side - bounds.height) / 2);
        outCtx.drawImage(
          workCanvas,
          bounds.minX,
          bounds.minY,
          bounds.width,
          bounds.height,
          dx,
          dy,
          bounds.width,
          bounds.height
        );

        const dataUrl = outCanvas.toDataURL('image/png');
        cachedCutoutUrl = dataUrl;
        resolve(dataUrl);
      } catch {
        resolve(PEBBY_MASTER_SRC);
      }
    };
    img.onerror = () => resolve(PEBBY_MASTER_SRC);
    img.src = PEBBY_MASTER_SRC;
  });

  return cachedCutoutPromise;
}
