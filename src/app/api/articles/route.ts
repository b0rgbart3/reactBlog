import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Articles } from '@/src/models/Articles';
import path from 'path';
import fs from 'fs/promises';

function getRandomHexColor(): string {
  return Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
}

export async function GET() {
  await connectDB();
  const all = await Articles.find();
  return NextResponse.json({ data: all });
}

export async function POST(request: NextRequest) {
  await connectDB();
  try {
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

    body.randomColor = getRandomHexColor();
    body.originDate = new Date().toISOString().split('T')[0];

    const doc = new Articles(body);
    await doc.save();
    return NextResponse.json(doc);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
