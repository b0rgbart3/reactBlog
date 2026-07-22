import type { Metadata } from 'next';
import { SynchronicityLanding } from '@/src/views/SynchronicityLanding';

export const metadata: Metadata = {
  title: 'Synchronicity — Interactive 3D Bitcoin Visualization',
  description: 'An interactive 3D globe visualization for Bitcoin data. See block activity, node distribution, and live price data rendered in real time.',
};

export default function SynchronicityLandingPage() {
  return <SynchronicityLanding />;
}
