// server/services/email.js
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendContactEmail({ name, email, message, }) {
    return resend.emails.send({
        from: 'info@moon-math.online',
        to: 'info@moon-math.online',
        bcc: 'b0rgbart3@gmail.com',
        subject: 'New contact form submission',
        html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p>${message}</p>
    `,
    });
}
