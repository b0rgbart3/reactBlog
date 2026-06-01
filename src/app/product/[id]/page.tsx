import type { Metadata } from 'next';
import { connectDB } from '@/src/lib/mongodb';
import { Products } from '@/src/models/Products';
import { ProductPage } from '@/src/views/Products/ProductPage';

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  await connectDB();

  const product = await Products.findById(id).lean() as any;
  if (!product) return { title: 'Product not found' };

  return {
    title: product.productName,
    description: product.productDescription?.substring(0, 160),
    openGraph: {
      title: product.productName,
      description: product.productDescription?.substring(0, 160),
      images: product.beauty ? [{ url: product.beauty }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.productName,
      description: product.productDescription?.substring(0, 160),
      images: product.beauty ? [product.beauty] : [],
    },
  };
}

export async function generateStaticParams() {
  await connectDB();
  const products = await Products.find({}, '_id').lean();
  return products.map((p: any) => ({ id: String(p._id) }));
}

export default function ProductPageRoute() {
  return <ProductPage />;
}
