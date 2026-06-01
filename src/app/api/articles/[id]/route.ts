import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectDB } from '@/src/lib/mongodb';
import { Articles } from '@/src/models/Articles';
import path from 'path';
import fs from 'fs/promises';

function getRandomHexColor(): string {
  return Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  try {
    const { id } = await params;
    const formData = await request.formData();
    const body: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (key === 'headlineImage') continue;
      if (key === 'articleImages') {
        body.articleImages = [...(body.articleImages ?? []), value];
      } else {
        body[key] = value;
      }
    }

    const file = formData.get('headlineImage') as File | null;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}${path.extname(file.name)}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'articles');
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      body.headlineImage = `/uploads/articles/${filename}`;
    }

    delete body._id;
    body.lastModifiedDate = new Date().toISOString().split('T')[0];
    body.randomColor = getRandomHexColor();

    const updated = await Articles.findByIdAndUpdate(id, body, { new: true });
    if (!updated) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    revalidatePath(`/article/${id}`);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  try {
    const { id } = await params;
    const deleted = await Articles.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    return NextResponse.json({ success: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
