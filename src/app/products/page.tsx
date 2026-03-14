import type { Metadata } from 'next';
import { ProductsPage } from '@/src/views/Products/ProductsPage';

export const metadata: Metadata = {
  title: 'Merch — Moon-Math',
  description: 'Bitcoin merch from Moon-Math — t-shirts and more.',
};

export default function MerchPage() {
  return <ProductsPage />;
}
