import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Load .env.local first (Next.js convention), then .env as fallback
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Configure cloudinary after env vars are loaded
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const CLOUDINARY_PREFIX = 'hotel-assets';
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MAX_CONCURRENCY = 5;

function collectImageFiles(dir: string): string[] {
  const files: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectImageFiles(fullPath));
    } else if (ALLOWED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

function toPublicId(filePath: string): string {
  const relative = path.relative(PUBLIC_DIR, filePath);
  const withoutExt = relative.replace(path.extname(relative), '');
  return `${CLOUDINARY_PREFIX}/${withoutExt}`;
}

async function uploadFile(
  filePath: string,
  index: number,
  total: number,
): Promise<'uploaded' | 'skipped' | 'failed'> {
  const publicId = toPublicId(filePath);

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      resource_type: 'image',
      overwrite: false,
      unique_filename: false,
    });

    const wasExisting = result.existing === true;
    if (wasExisting) {
      console.log(`[${index}/${total}] Skipped (exists): ${publicId}`);
      return 'skipped';
    }

    console.log(`[${index}/${total}] Uploaded: ${publicId}`);
    return 'uploaded';
  } catch (error) {
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    console.error(`[${index}/${total}] Failed: ${publicId} — ${message}`);
    return 'failed';
  }
}

async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index++;
      await fn(items[current]);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
}

async function main() {
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    console.error('Error: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set. Check your .env.local file.');
    process.exit(1);
  }

  console.log('Scanning public/ for image files...');
  const files = collectImageFiles(PUBLIC_DIR);
  console.log(`Found ${files.length} image(s) to process.\n`);

  if (files.length === 0) {
    console.log('No images found. Exiting.');
    return;
  }

  const total = files.length;
  const results: ('uploaded' | 'skipped' | 'failed')[] = [];
  let counter = 0;

  await runWithConcurrency(files, MAX_CONCURRENCY, async (filePath) => {
    const i = ++counter;
    const result = await uploadFile(filePath, i, total);
    results.push(result);
  });

  const uploaded = results.filter((r) => r === 'uploaded').length;
  const skipped = results.filter((r) => r === 'skipped').length;
  const failed = results.filter((r) => r === 'failed').length;

  console.log(`\n--- Summary ---`);
  console.log(`Uploaded: ${uploaded}`);
  console.log(`Skipped:  ${skipped}`);
  console.log(`Failed:   ${failed}`);
  console.log(`Total:    ${total}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
