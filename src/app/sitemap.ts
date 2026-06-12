import { MetadataRoute } from 'next';
import { connectDB } from '@/src/lib/mongodb';
import { Articles } from '@/src/models/Articles';
import { Products } from '@/src/models/Products';

const base = 'https://moon-math.online';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const [articles, products] = await Promise.all([
    Articles.find({ readyToPublish: true }, '_id lastModifiedDate originDate').lean(),
    Products.find({ readyToPublish: true }, '_id').lean(),
  ]);

  const articleEntries: MetadataRoute.Sitemap = (articles as any[]).map((a) => ({
    url: `${base}/article/${a._id}`,
    lastModified: a.lastModifiedDate || a.originDate || undefined,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = (products as any[]).map((p) => ({
    url: `${base}/product/${p._id}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    { url: `${base}/`,               lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/articles`,        lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${base}/products`,        lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/resources`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/about`,           lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${base}/memes`,           lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.5 },
    { url: `${base}/calculator-landing`,  changeFrequency: 'yearly', priority: 0.6 },
    { url: `${base}/countdown-landing`,   changeFrequency: 'yearly', priority: 0.6 },
    { url: `${base}/simplcagr-landing`,   changeFrequency: 'yearly', priority: 0.6 },
    ...articleEntries,
    ...productEntries,
  ];
}
