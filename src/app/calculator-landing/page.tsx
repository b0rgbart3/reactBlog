import type { Metadata } from 'next';
import { CalculatorLanding } from '@/src/views/CalculatorLanding';

export const metadata: Metadata = {
  title: 'Bitcoin Retirement Calculator',
  description: 'Model your path to Bitcoin financial independence with the Moon-Math retirement calculator.',
};

export default function CalculatorLandingPage() {
  return <CalculatorLanding />;
}
