#!/usr/bin/env node
/**
 * Minimal PNG writer (no deps) — solid rounded-ish tiles for agent states.
 */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outs = [
  join(root, "assets/icons"),
  join(root, "plugin/com.vibe.deck.status.ulanziPlugin/Images"),
];

const COLORS = {
  idle: [245, 245, 247],
  thinking: [47, 128, 246],
  done: [52, 199, 89],
  needs_input: [255, 159, 10],
  error: [255, 69, 58],
  empty: [72, 72, 74],
};

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function pngRGB(width, height, rgbaFn) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = rgbaFn(x, y);
      const i = row + 1 + x * 4;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
      raw[i + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function makeTile([r, g, b]) {
  const size = 144;
  const radius = 28;
  return pngRGB(size, size, (x, y) => {
    const dx = Math.min(x, size - 1 - x);
    const dy = Math.min(y, size - 1 - y);
    const inside =
      dx >= radius ||
      dy >= radius ||
      (dx - radius) ** 2 + (dy - radius) ** 2 <= radius ** 2;
    if (!inside) return [0, 0, 0, 0];
    // subtle top highlight
    const t = y / size;
    const rr = Math.min(255, Math.round(r + (1 - t) * 18));
    const gg = Math.min(255, Math.round(g + (1 - t) * 18));
    const bb = Math.min(255, Math.round(b + (1 - t) * 18));
    // inner circle badge
    const cx = size / 2;
    const cy = size / 2;
    const dist = Math.hypot(x - cx, y - cy);
    if (dist < 22) return [255, 255, 255, 230];
    return [rr, gg, bb, 255];
  });
}

for (const dir of outs) mkdirSync(dir, { recursive: true });

for (const [name, color] of Object.entries(COLORS)) {
  const buf = makeTile(color);
  for (const dir of outs) {
    const file = join(dir, `agent-${name}.png`);
    writeFileSync(file, buf);
    console.log("wrote", file);
  }
}

// plugin category / action icons (reuse thinking/idle)
for (const dir of outs.slice(1)) {
  writeFileSync(join(dir, "plugin.png"), makeTile(COLORS.thinking));
  writeFileSync(join(dir, "category.png"), makeTile(COLORS.done));
}
