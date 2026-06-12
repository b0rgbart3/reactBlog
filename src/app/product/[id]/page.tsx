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

export default async function ProductPageRoute(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const product = await Products.findById(id).lean() as any;

  const base = 'https://moon-math.online';
  const images = [
    product?.beauty,
    ...(product?.productImages ?? []),
  ]
    .filter(Boolean)
    .map((img: string) => img.startsWith('http') ? img : `${base}${img}`);

  const jsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.productName,
    description: product.productDescription,
    image: images,
    brand: { '@type': 'Brand', name: 'Moon-Math' },
    offers: {
      '@type': 'Offer',
      url: `${base}/product/${id}`,
      priceCurrency: 'USD',
      price: (product.price / 100).toFixed(2),
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Moon-Math' },
    },
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductPage />
    </>
  );
}
