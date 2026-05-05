import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const publicDir = join(process.cwd(), 'public');
const iconsDir = join(publicDir, 'icons');

// Ensure icons directory exists
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  // Generate PWA icons from favicon
  for (const size of sizes) {
    await sharp(join(publicDir, 'favicon-base.png'))
      .resize(size, size)
      .png()
      .toFile(join(iconsDir, `icon-${size}x${size}.png`));
    console.log(`Generated icon-${size}x${size}.png`);
  }

  // Generate favicon.ico
  await sharp(join(publicDir, 'favicon-base.png'))
    .resize(32, 32)
    .png()
    .toFile(join(publicDir, 'favicon.ico'));
  console.log('Generated favicon.ico');

  // Generate apple-touch-icon
  await sharp(join(publicDir, 'favicon-base.png'))
    .resize(180, 180)
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // Generate small logo
  await sharp(join(publicDir, 'logo.png'))
    .resize(200, 60, { fit: 'inside', withoutEnlargement: true })
    .png()
    .toFile(join(publicDir, 'logo-small.png'));
  console.log('Generated logo-small.png');

  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
