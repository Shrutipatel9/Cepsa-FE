// One-time image optimizer: converts heavy PNG/JPG assets to resized WebP and
// shrinks the public logo in place. Run with: node scripts/optimize-images.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');

// [source, max width] — header banners are full-bleed, content photos are not
const assets = [
  ['src/assets/header_images/about_us.png', 1920],
  ['src/assets/header_images/coontact_us.png', 1920],
  ['src/assets/header_images/e-catelogue.png', 1920],
  ['src/assets/header_images/export.png', 1920],
  ['src/assets/header_images/gallery.png', 1920],
  ['src/assets/header_images/products.png', 1920],
  ['src/assets/choose_us/choose_us_photo_1.png', 1400],
  ['src/assets/choose_us/choose_us_photo_2.png', 1400],
  ['src/assets/choose_us/choose_us_photo_3.png', 1400],
  ['src/assets/choose_us/choose_us_photo_4.png', 1400],
  ['src/assets/about_us_image.png', 1400],
  ['src/assets/company_profile.png', 1400],
  ['src/assets/company_profile_2.png', 1400],
  ['src/assets/e-catalogue-image.png', 1000],
  ['src/assets/export.png', 1400],
];

// Logos stay PNG at the same path (HeroScene samples /cepsa-logo.png pixels up to 960px wide)
const logos = [
  ['public/cepsa-logo.png', 1000],
];

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const rows = [];

for (const [rel, maxWidth] of assets) {
  const src = path.join(root, rel);
  const out = src.replace(/\.(png|jpe?g)$/i, '.webp');
  const before = (await fs.stat(src)).size;
  await sharp(src)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 78, effort: 6 })
    .toFile(out);
  const after = (await fs.stat(out)).size;
  await fs.unlink(src);
  rows.push([rel, kb(before), kb(after)]);
}

for (const [rel, maxWidth] of logos) {
  const src = path.join(root, rel);
  const before = (await fs.stat(src)).size;
  const buf = await sharp(src)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer();
  await fs.writeFile(src, buf);
  rows.push([rel, kb(before), kb(buf.length)]);
}

console.table(rows.map(([file, before, after]) => ({ file, before, after })));
