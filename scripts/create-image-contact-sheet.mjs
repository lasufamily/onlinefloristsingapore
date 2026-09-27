import { mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(
  readFileSync(new URL('src/data/knowledge-images.json', root), 'utf8'),
);
const outputDirectory = new URL('artifacts/', root);
const outputPath = new URL('knowledge-page-images-contact-sheet.jpg', outputDirectory);

const columns = 5;
const tileWidth = 240;
const imageHeight = 180;
const labelHeight = 42;
const rows = Math.ceil(manifest.length / columns);
const composites = [];

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

for (const [index, item] of manifest.entries()) {
  const left = (index % columns) * tileWidth;
  const top = Math.floor(index / columns) * (imageHeight + labelHeight);
  const thumbnail = await sharp(
    fileURLToPath(new URL(`public/images/generated/pages/${item.filename}`, root)),
  )
    .resize(tileWidth, imageHeight, { fit: 'cover' })
    .jpeg({ quality: 82 })
    .toBuffer();
  const label = Buffer.from(
    `<svg width="${tileWidth}" height="${labelHeight}">
      <rect width="100%" height="100%" fill="#ffffff"/>
      <text x="8" y="17" font-family="Arial, sans-serif" font-size="11" fill="#111111">${escapeXml(item.path.slice(0, 38))}</text>
      <text x="8" y="33" font-family="Arial, sans-serif" font-size="10" fill="#555555">${escapeXml(item.path.slice(38, 78))}</text>
    </svg>`,
  );

  composites.push({ input: thumbnail, left, top });
  composites.push({ input: label, left, top: top + imageHeight });
}

mkdirSync(outputDirectory, { recursive: true });
await sharp({
  create: {
    width: columns * tileWidth,
    height: rows * (imageHeight + labelHeight),
    channels: 3,
    background: '#ffffff',
  },
})
  .composite(composites)
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(fileURLToPath(outputPath));

console.log(fileURLToPath(outputPath));
