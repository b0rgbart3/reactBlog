import type { Metadata } from 'next';
import { SimplCAGRLanding } from '@/src/views/SimplCAGRLanding';

export const metadata: Metadata = {
  title: 'simplCAGR — Compound Annual Growth Rate Calculator',
  description: 'Calculate the Compound Annual Growth Rate of any investment. Simple, fast, no spreadsheet required.',
};

export default function SimplCAGRLandingPage() {
  return <SimplCAGRLanding />;
}
