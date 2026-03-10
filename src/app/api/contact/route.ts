import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'info@moon-math.online',
      to: 'info@moon-math.online',
      bcc: 'b0rgbart3@gmail.com',
      subject: 'New contact form submission from Moon-Math',
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error sending contact email:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
