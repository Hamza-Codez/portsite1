import sharp from "sharp";
import { statSync } from "fs";
const dir = "public/assets/testimonials";
const meta = await sharp(`${dir}/imBlack.png`).metadata();
await sharp(`${dir}/imBlack.png`)
  .resize({ width: Math.min(meta.width, 2560), withoutEnlargement: true })
  .modulate({ brightness: 0.4 })
  .webp({ quality: 82, effort: 6 })
  .toFile(`${dir}/bg-dark.webp`);
const { data, info } = await sharp(`${dir}/bg-dark.webp`).raw().toBuffer({ resolveWithObject: true });
let peak = 0;
for (let i = 0; i < data.length; i += info.channels) {
  const l = 0.2126*data[i] + 0.7152*data[i+1] + 0.0722*data[i+2];
  if (l > peak) peak = l;
}
console.log(`bg-dark.webp dimmed -> ${(statSync(`${dir}/bg-dark.webp`).size/1024).toFixed(0)} KB, peak luminance ${peak.toFixed(0)}/255`);
