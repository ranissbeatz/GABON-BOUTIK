const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

async function generateAssets() {
  try {
    console.log('Generating assets...');

    // 1. Generate logo-gabonboutik.png (1200x400)
    await sharp(path.join(publicDir, 'logo-gabonboutik.svg'))
      .resize(1200, 400)
      .png()
      .toFile(path.join(publicDir, 'logo-gabonboutik.png'));
    console.log('✓ logo-gabonboutik.png generated');

    // 2. Generate favicon.ico (32x32) - actually a PNG disguised or just small PNG
    // We use logo-icon.svg for the favicon to make it readable
    await sharp(path.join(publicDir, 'logo-icon.svg'))
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon.ico')); 
    console.log('✓ favicon.ico generated (32x32 PNG format)');

    // 3. Generate pattern-wax-gabon.png (1200x800 for background)
    await sharp(path.join(publicDir, 'pattern-wax-gabon.svg'))
      .resize(1200, 800)
      .png()
      .toFile(path.join(publicDir, 'pattern-wax-gabon.png'));
    console.log('✓ pattern-wax-gabon.png generated');

  } catch (err) {
    console.error('Error generating assets:', err);
  }
}

generateAssets();
