import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Memes } from '@/src/models/Memes';
import path from 'path';
import fs from 'fs/promises';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    const formData = await request.formData();
    const updates: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (key === 'image') continue;
      updates[key] = value;
    }

    const file = formData.get('image') as File | null;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}${path.extname(file.name)}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'memes');
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      updates.image = `/uploads/memes/${filename}`;
    }

    const doc = await Memes.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json(doc);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    await Memes.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
