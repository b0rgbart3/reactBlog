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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  try {
    const { id } = await params;
    const formData = await request.formData();
    const body: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (!['images', 'newBeauty', 'newThumbnail', 'productImages'].includes(key)) {
        body[key] = value;
      }
    }

    const imageFiles = formData.getAll('images') as File[];
    const uploadedImages: string[] = [];
    for (const img of imageFiles) {
      if (img.size > 0) uploadedImages.push(await saveFile(img, 'products'));
    }

    const existingImages = formData.getAll('productImages') as string[];
    body.productImages = [...existingImages, ...uploadedImages];

    const beautyFile = formData.get('newBeauty') as File | null;
    if (beautyFile && beautyFile.size > 0) body.beauty = await saveFile(beautyFile, 'products');

    const thumbnailFile = formData.get('newThumbnail') as File | null;
    if (thumbnailFile && thumbnailFile.size > 0) body.thumbnail = await saveFile(thumbnailFile, 'products');

    const updated = await Products.findByIdAndUpdate(id, body, { new: true });
    if (!updated) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  try {
    const { id } = await params;
    const deleted = await Products.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
