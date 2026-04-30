import type { Metadata } from 'next';
import { CountdownLanding } from '@/src/views/CountdownLanding';

export const metadata: Metadata = {
  title: 'The Millionth Block Countdown',
  description: 'Track the countdown to Bitcoin block number 1,000,000 — a historic milestone in the history of the Bitcoin blockchain.',
};

export default function CountdownLandingPage() {
  return <CountdownLanding />;
}
