// Generates social share images and the Apple touch icon at build time,
// so no binary files need to live in the repository.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function card({ kicker, lines, foot }) {
  const text = lines
    .map((l, i) => `<text x="80" y="${250 + i * 84}" font-family="Georgia, 'Times New Roman', serif" font-size="68" font-weight="700" fill="#1c1917">${esc(l)}</text>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#c2620a"/><stop offset="1" stop-color="#0f766e"/></linearGradient></defs>
  <rect width="1200" height="630" fill="#faf7f2"/>
  <rect width="1200" height="14" fill="url(#g)"/>
  <circle cx="92" cy="96" r="12" fill="url(#g)"/>
  <text x="118" y="108" font-family="Georgia, serif" font-size="34" font-weight="700" fill="#1c1917">AINPM.in</text>
  <text x="80" y="176" font-family="Verdana, Arial, sans-serif" font-size="24" letter-spacing="3" fill="#c2620a">${esc(kicker.toUpperCase())}</text>
  ${text}
  <text x="80" y="560" font-family="Verdana, Arial, sans-serif" font-size="26" fill="#57534e">${esc(foot)}</text>
</svg>`;
}

const cards = {
  'default.png': card({
    kicker: 'Field guide · Case study · Articles',
    lines: ['AI-native product', 'management,', 'built from India.'],
    foot: 'By Ian Pinto · ainpm.in',
  }),
  'sebi-rag.png': card({
    kicker: 'AI-native PM case study',
    lines: ['SEBI Circular RAG:', 'cited answers over', '1,490 SEBI circulars.'],
    foot: 'Recall@10 0.943 · Abstention accuracy 0.981 · ainpm.in/sebi-rag',
  }),
};

await mkdir('public/og', { recursive: true });
for (const [name, svg] of Object.entries(cards)) {
  await sharp(Buffer.from(svg)).png().toFile(`public/og/${name}`);
}

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0f766e"/><text x="32" y="42" font-family="Georgia,serif" font-size="30" font-weight="700" text-anchor="middle" fill="#fff">ai</text><circle cx="50" cy="16" r="5" fill="#e8871e"/></svg>`;
await sharp(Buffer.from(icon)).resize(180, 180).png().toFile('public/apple-touch-icon.png');
console.log('og: generated', Object.keys(cards).join(', '), '+ apple-touch-icon.png');
