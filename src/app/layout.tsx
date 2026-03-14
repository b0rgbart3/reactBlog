import type { Metadata } from 'next';
import '@/src/styles/index.scss';

export const metadata: Metadata = {
  metadataBase: new URL('https://moon-math.online'),
  title: {
    default: 'moon-math.online',
    template: '%s | moon-math.online',
  },
  description: 'A blog about bitcoin — exploring math, computer science, and ideas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
