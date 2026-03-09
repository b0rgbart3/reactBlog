import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Settings } from '@/src/models/Settings';

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const settings = await Settings.find();
    const showMerch = settings.find((s) => s.name === 'showMerch');

    if (showMerch) {
      showMerch.booleanValue = !showMerch.booleanValue;
      await Settings.findByIdAndUpdate(showMerch._id, showMerch);
      return NextResponse.json({ success: true, booleanValue: showMerch.booleanValue });
    } else {
      const setting = new Settings({ name: 'showMerch', booleanValue: true });
      await setting.save();
      return NextResponse.json(setting);
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
