import type { Metadata } from 'next';
import { ArticlesPage } from '@/src/views/Articles/ArticlesPage';

export const metadata: Metadata = {
  title: 'Articles — Moon-Math',
  description: 'Bitcoin articles from Moon-Math.',
};

export default function ArticlesLandingPage() {
  return <ArticlesPage />;
}
