import type { Metadata } from 'next';
import { BitcoinGlobeLanding } from '@/src/views/BitcoinGlobeLanding';

export const metadata: Metadata = {
  title: 'Bitcoin Globe — Interactive 3D Bitcoin Visualization',
  description: 'An interactive 3D globe visualization for Bitcoin data. See block activity, node distribution, and live price data rendered in real time.',
};

export default function BitcoinGlobeLandingPage() {
  return <BitcoinGlobeLanding />;
}
