import test from 'node:test';
import assert from 'node:assert/strict';
import { computeOpaqueBounds, removeExteriorBackground } from './pebbyCutout';

function makeCanvas(w: number, h: number, bg: [number, number, number]): Uint8ClampedArray {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    data[i * 4] = bg[0];
    data[i * 4 + 1] = bg[1];
    data[i * 4 + 2] = bg[2];
    data[i * 4 + 3] = 255;
  }
  return data;
}

function fillRect(
  data: Uint8ClampedArray,
  w: number,
  x0: number,
  y0: number,
  rw: number,
  rh: number,
  rgb: [number, number, number]
) {
  for (let y = y0; y < y0 + rh; y++) {
    for (let x = x0; x < x0 + rw; x++) {
      const o = (y * w + x) * 4;
      data[o] = rgb[0];
      data[o + 1] = rgb[1];
      data[o + 2] = rgb[2];
      data[o + 3] = 255;
    }
  }
}

test('removeExteriorBackground clears dark navy border while preserving enclosed dark navy eyes', () => {
  const w = 24;
  const h = 24;
  const darkNavy: [number, number, number] = [10, 13, 46];
  const violetBody: [number, number, number] = [118, 122, 248];
  const whiteFace: [number, number, number] = [250, 250, 252];

  const data = makeCanvas(w, h, darkNavy);
  // Draw Pebby violet body in center (6..17, 6..17)
  fillRect(data, w, 6, 6, 12, 12, violetBody);
  // Draw white face inside body (8..15, 8..15)
  fillRect(data, w, 8, 8, 8, 8, whiteFace);
  // Draw dark navy eye INSIDE white face (10..11, 10..11) — same RGB as exterior bg!
  fillRect(data, w, 10, 10, 2, 2, darkNavy);

  removeExteriorBackground(data, w, h);

  // Exterior corner must be fully transparent
  assert.equal(data[(0 * w + 0) * 4 + 3], 0);
  assert.equal(data[(2 * w + 2) * 4 + 3], 0);

  // Violet body pixel must stay fully opaque
  assert.equal(data[(7 * w + 7) * 4 + 3], 255);

  // Interior dark-navy eye enclosed by white face must remain 100% opaque!
  assert.equal(data[(10 * w + 10) * 4 + 3], 255);
  assert.equal(data[(11 * w + 11) * 4 + 3], 255);
});

test('computeOpaqueBounds crops tightly around Pebby silhouette with requested padding', () => {
  const w = 40;
  const h = 40;
  const data = makeCanvas(w, h, [10, 13, 46]);
  fillRect(data, w, 12, 10, 16, 20, [118, 122, 248]);
  removeExteriorBackground(data, w, h);

  const bounds = computeOpaqueBounds(data, w, h, 20, 2);
  assert.equal(bounds.minX, 10);
  assert.equal(bounds.minY, 8);
  assert.equal(bounds.maxX, 29);
  assert.equal(bounds.maxY, 31);
  assert.equal(bounds.width, 20);
  assert.equal(bounds.height, 24);
});
