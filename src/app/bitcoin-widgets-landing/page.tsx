import type { Metadata } from 'next';
import { BitcoinWidgetsLanding } from '@/src/views/BitcoinWidgetsLanding';

export const metadata: Metadata = {
  title: 'Bitcoin Widgets — React Components for Real-Time Bitcoin Data',
  description: 'Drop-in React components for live Bitcoin price, block height, and halving countdown. No API keys required. Available on npm.',
};

export default function BitcoinWidgetsLandingPage() {
  return <BitcoinWidgetsLanding />;
}
