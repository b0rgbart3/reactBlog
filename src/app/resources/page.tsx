import type { Metadata } from 'next';
import { Resources } from '@/src/views/Resources';

export const metadata: Metadata = {
  title: 'Bitcoin Resources',
  description: 'Recommended Bitcoin books, podcasts, wallets, and businesses curated by Moon-Math.',
};

export default function ResourcesPage() {
  return <Resources />;
}
