import type { Metadata } from 'next';
import { connectDB } from '@/src/lib/mongodb';
import { Articles } from '@/src/models/Articles';
import { Users } from '@/src/models/Users';
import { BannerNav } from '@/src/components/banner-nav';
import { ArticleHeadlineImage } from '@/src/components/ArticleHeadlineImage';
import parse, { Element as HtmlElement } from 'html-react-parser';
import { splitIntoLines, renderMath } from '@/src/utils/articleUtils';
import { CodeBlockDisplay } from '@/src/components/CodeBlockDisplay';
import React from 'react';

const parseOptions = {
  replace(node: any) {
    if (!(node instanceof HtmlElement) || node.name !== 'pre') return;
    const codeEl = node.children?.find(
      (c: any) => c instanceof HtmlElement && c.name === 'code'
    ) as HtmlElement | undefined;
    if (!codeEl) return;

    const langClass = (codeEl.attribs?.class ?? '')
      .split(' ')
      .find((c: string) => c.startsWith('language-'));
    const language = langClass ? langClass.replace('language-', '') : undefined;

    const rawCode = codeEl.children
      ?.map((c: any) => ('data' in c ? c.data : ''))
      .join('') ?? '';

    return <CodeBlockDisplay code={rawCode} language={language} />;
  },
};

export const revalidate = 3600; // regenerate at most once per hour

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://moon-math.online';

function absoluteUrl(path: string): string {
  if (!path) return '';
  return path.startsWith('http') ? path : `${BASE_URL}${path}`;
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  await connectDB();

  const article = await Articles.findById(id).lean() as any;
  if (!article) return { title: 'Article not found' };

  const description = article.body
    ?.replace(/<[^>]*>/g, '')
    .replace(/\\n/g, ' ')
    .substring(0, 160);

  return {
    title: article.title,
    description,
    openGraph: {
      title: article.title,
      description,
      images: article.headlineImage
        ? [{ url: absoluteUrl(article.headlineImage), width: 1200, height: 630 }]
        : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: article.headlineImage ? [absoluteUrl(article.headlineImage)] : [],
    },
  };
}

export async function generateStaticParams() {
  await connectDB();
  const articles = await Articles.find({}, '_id').lean();
  return articles.map((a: any) => ({ id: String(a._id) }));
}

export default async function ArticlePageSSG({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();

  const article = await Articles.findById(id).lean() as any;
  const author = article ? await Users.findById(article.userID).lean() as any : null;

  if (!article) {
    return <div>Article not found</div>;
  }

  const body = renderMath(article.body ?? '');
  const isHtml = /<[a-z][\s\S]*>/i.test(body);
  const paragraphs = isHtml ? [] : splitIntoLines(body);

  return (
    <>
      <BannerNav page="article" />
      <div className="article">
        <div className="articlePageCategory">{article.category}</div>

        {article.headlineImage ? (
          <ArticleHeadlineImage src={article.headlineImage} randomColor={article.randomColor} />
        ) : (
          <div
            className="noHeadlineImageContainer"
            style={article.randomColor ? ({ '--article-color': `#${article.randomColor}` } as React.CSSProperties) : undefined}
          ></div>
        )}

        <div className="articleContainer">
          <div className="articlePageTitle">{article.title}</div>
          {article.subtitle && (
            <div className="articlePageSubtitle">{article.subtitle}</div>
          )}
          <div className="authorName">
            Author: {author?.authorName || author?.userName || 'Unknown'}
          </div>
          <div className="originDate">
            Originally published: {article.originDate ?? ''}
          </div>
          <div className="modifiedDate">
            Last modified: {article.lastModifiedDate ?? ''}
          </div>
          <div className="articleBody">
            {isHtml
              ? parse(body, parseOptions)
              : paragraphs.map((par, index) => (
                  <p key={index}>{parse(par)}</p>
                ))
            }
          </div>
        </div>
      </div>
    </>
  );
}
