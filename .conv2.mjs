import sharp from "sharp";
import { statSync } from "fs";

const dir = "public/assets/testimonials";
const jobs = [
  { src: `${dir}/imBlack.png`, out: `${dir}/bg-dark.webp` },
  { src: `${dir}/imWite.png`, out: `${dir}/bg-light.webp` },
];

async function stats(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let peak = 0, sum = 0, n = 0;
  // bottom third = where the trust strip sits
  let bPeak = 0, bSum = 0, bN = 0;
  const bandStart = Math.floor(height * 0.66);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      if (lum > peak) peak = lum;
      sum += lum; n++;
      if (y >= bandStart) { if (lum > bPeak) bPeak = lum; bSum += lum; bN++; }
    }
  }
  return { peak: peak.toFixed(0), mean: (sum / n).toFixed(1), bandPeak: bPeak.toFixed(0), bandMean: (bSum / bN).toFixed(1) };
}

for (const j of jobs) {
  const meta = await sharp(j.src).metadata();
  await sharp(j.src)
    .resize({ width: Math.min(meta.width, 2560), withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(j.out);
  const before = (statSync(j.src).size / 1024).toFixed(0);
  const after = (statSync(j.out).size / 1024).toFixed(0);
  const s = await stats(j.out);
  console.log(
    `${j.out}\n  ${meta.width}x${meta.height}  ${before} KB -> ${after} KB (-${(100 - (after / before) * 100).toFixed(1)}%)\n` +
    `  luminance: peak ${s.peak}  mean ${s.mean}  | bottom-third: peak ${s.bandPeak}  mean ${s.bandMean}`
  );
}
