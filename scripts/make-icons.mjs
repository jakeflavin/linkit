/**
 * Writes the app icons as PNGs.
 *
 * Home-screen icons have to be PNG — iOS ignores an SVG apple-touch-icon — so they are
 * generated here rather than hand-drawn, and committed. Run `npm run icons` after
 * changing the mark. The PNG is written directly rather than pulling in an image
 * library for three small files.
 *
 * The mark matches public/favicon.svg: the upvote arrow in white on Reddit
 * orange — the one gesture the whole app is built around (see DESIGN.md).
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'

const OUT = new URL('../public/', import.meta.url)

/** Reddit orange, a shade deeper toward the bottom so the disc reads round. */
const BACKDROP = [
  { stop: 0, rgb: [255, 82, 25] },
  { stop: 1, rgb: [224, 61, 0] },
]

const WHITE = [255, 255, 255]

/** The arrow: a head and a stem, sized off the icon's unit square. */
const HEAD = { apexY: 0.26, baseY: 0.56, halfW: 0.26 }
const STEM = { x: 0.5, y: 0.66, hw: 0.095, hh: 0.12, r: 0.02 }

/** Signed distance to a rounded rectangle: negative inside, positive outside. */
function roundRect(u, v, box) {
  const dx = Math.abs(u - box.x) - (box.hw - box.r)
  const dy = Math.abs(v - box.y) - (box.hh - box.r)
  const outside = Math.hypot(Math.max(dx, 0), Math.max(dy, 0))
  return outside + Math.min(Math.max(dx, dy), 0) - box.r
}

/**
 * Signed distance to the arrowhead. The shape is mirrored about the centre,
 * so one slanted edge and the base describe the whole triangle.
 */
function arrowHead(u, v, head) {
  const ux = Math.abs(u - 0.5)
  const rise = head.baseY - head.apexY
  const length = Math.hypot(head.halfW, rise)
  const slant = (rise * ux - head.halfW * (v - head.apexY)) / length
  return Math.max(v - head.baseY, slant)
}

const lerp = (a, b, t) => a + (b - a) * t
const clamp01 = (n) => (n < 0 ? 0 : n > 1 ? 1 : n)

function crc32(buf) {
  const table = []
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  let crc = 0xffffffff
  for (const byte of buf) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

function png(size, pixels) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // truecolour, no alpha: an icon is opaque
  // Each scanline carries a leading filter byte; 0 means "store as is".
  const raw = Buffer.alloc(size * (size * 3 + 1))
  let at = 0
  for (let y = 0; y < size; y++) {
    raw[at++] = 0
    for (let x = 0; x < size; x++) {
      const [r, g, b] = pixels[y * size + x]
      raw[at++] = r
      raw[at++] = g
      raw[at++] = b
    }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function render(size) {
  const pixels = new Array(size * size)
  const edge = 1.2 / size

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / (size - 1)
      const v = y / (size - 1)

      let rgb = BACKDROP[0].rgb.map((c, i) => lerp(c, BACKDROP[1].rgb[i], v))

      // One white mark on the orange field: arrowhead, then stem.
      const paint = (d, colour) => {
        const cover = clamp01(-d / edge)
        if (cover > 0) rgb = rgb.map((c, i) => lerp(c, colour[i], cover))
      }

      paint(arrowHead(u, v, HEAD), WHITE)
      paint(roundRect(u, v, STEM), WHITE)

      pixels[y * size + x] = rgb.map((c) => Math.round(clamp01(c / 255) * 255))
    }
  }

  return png(size, pixels)
}

// 180 is what iOS asks for; 192 and 512 are what a manifest wants.
for (const size of [180, 192, 512]) {
  writeFileSync(new URL(`icon-${size}.png`, OUT), render(size))
  console.log(`wrote public/icon-${size}.png`)
}
