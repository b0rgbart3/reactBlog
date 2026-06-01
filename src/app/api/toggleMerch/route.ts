import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Settings } from '@/src/models/Settings';

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const body = await request.json().catch(() => ({}));
    const settingName: string = body.settingName || 'showMerch';

    const settings = await Settings.find();
    const setting = settings.find((s) => s.name === settingName);

    if (setting) {
      setting.booleanValue = !setting.booleanValue;
      await Settings.findByIdAndUpdate(setting._id, setting);
      return NextResponse.json({ success: true, booleanValue: setting.booleanValue });
    } else {
      const newSetting = new Settings({ name: settingName, booleanValue: true });
      await newSetting.save();
      return NextResponse.json(newSetting);
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
