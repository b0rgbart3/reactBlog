import type { Metadata } from 'next';
import { About } from '@/src/views/About';

export const metadata: Metadata = {
  title: 'About Moon-Math',
  description: 'Learn about Moon-Math — a Bitcoin blog by Bart Dority exploring math, computer science, and Bitcoin ideas.',
};

export default function AboutPage() {
  return <About />;
}
