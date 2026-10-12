/**
 * Generates web assets from the official logo files in public/brand/:
 *   mambytech-logo.png  — official full logo (dark green, for light backgrounds)
 *   mambytech-mark.png  — official square mark
 *
 * Outputs (re-run after replacing the originals):
 *   public/brand/mambytech-logo-trimmed.png  — official logo without its transparent margin (used on the site)
 *   public/brand/mambytech-logo-on-dark.png  — same logo, wordmark recoloured for dark backgrounds
 *   public/brand/mambytech-mark-trimmed.png  — mark without its transparent margin
 *   app/icon.png, app/apple-icon.png         — favicons from the mark
 *
 *   node scripts/brand-assets.mjs
 */
import sharp from "sharp";

const LOGO = "public/brand/mambytech-logo.png";
const MARK = "public/brand/mambytech-mark.png";
const LIGHT = { r: 0xe8, g: 0xee, b: 0xf6 }; // --color-fg

await sharp(LOGO).trim().png({ compressionLevel: 9 }).toFile("public/brand/mambytech-logo-trimmed.png");

// Full logo: trim transparency, then recolour pixels right of the tile (the wordmark).
const trimmed = await sharp(LOGO).trim().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { data, info } = trimmed;
// The tile is the leftmost opaque run; find where the first fully transparent column after it starts.
const columnOpaque = (x) => {
  for (let y = 0; y < info.height; y++) if (data[(y * info.width + x) * 4 + 3] > 16) return true;
  return false;
};
let split = 0;
while (split < info.width && columnOpaque(split)) split++;
for (let y = 0; y < info.height; y++) {
  for (let x = split; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    data[i] = LIGHT.r;
    data[i + 1] = LIGHT.g;
    data[i + 2] = LIGHT.b;
  }
}
await sharp(data, { raw: info }).png({ compressionLevel: 9 }).toFile("public/brand/mambytech-logo-on-dark.png");
console.log(`logo-on-dark: ${info.width}x${info.height}, wordmark starts at x=${split}`);

// Mark: trim margin; favicons are square with the tile filling the canvas.
const markTrimmed = await sharp(MARK).trim().png().toBuffer();
await sharp(markTrimmed).png({ compressionLevel: 9 }).toFile("public/brand/mambytech-mark-trimmed.png");
const squareIcon = (size) =>
  sharp(markTrimmed).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png();
await squareIcon(512).toFile("app/icon.png");
// Apple touch icons don't support transparency well, so use the brand green behind the tile.
await sharp(markTrimmed)
  .resize(180, 180, { fit: "contain", background: { r: 7, g: 54, b: 46, alpha: 1 } })
  .flatten({ background: { r: 7, g: 54, b: 46 } })
  .png()
  .toFile("app/apple-icon.png");
console.log("mark + icons written");
