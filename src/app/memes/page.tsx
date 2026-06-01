import type { Metadata } from 'next';
import { MemesPage } from '@/src/views/MemesPage';

export const metadata: Metadata = {
  title: 'Bitcoin Memes',
  description: 'Bitcoin-related memes and designs from Moon-Math.',
};

export default function MemesRoute() { return <MemesPage />; }
