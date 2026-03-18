import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Products } from '@/src/models/Products';
import path from 'path';
import fs from 'fs/promises';

async function saveFile(file: File, subdir: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}${path.extname(file.name)}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', subdir);
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), buffer);
  return `/uploads/${subdir}/${filename}`;
}

export async function GET() {
  await connectDB();
  const all = await Products.find().sort({ _id: -1 });
  return NextResponse.json({ data: all });
}

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const formData = await request.formData();
    const body: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (!['images', 'newBeauty', 'newThumbnail'].includes(key)) {
        body[key] = value;
      }
    }

    const imageFiles = formData.getAll('images') as File[];
    const uploadedImages: string[] = [];
    for (const img of imageFiles) {
      if (img.size > 0) uploadedImages.push(await saveFile(img, 'products'));
    }
    body.productImages = uploadedImages;

    const beautyFile = formData.get('newBeauty') as File | null;
    if (beautyFile && beautyFile.size > 0) body.beauty = await saveFile(beautyFile, 'products');

    const thumbnailFile = formData.get('newThumbnail') as File | null;
    if (thumbnailFile && thumbnailFile.size > 0) body.thumbnail = await saveFile(thumbnailFile, 'products');

    const doc = new Products(body);
    await doc.save();
    return NextResponse.json(doc);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
