'use client';
import { useState } from 'react';
import hljs from 'highlight.js';

type Props = {
  code: string;
  language?: string;
};

export function CodeBlockDisplay({ code, language }: Props) {
  const [copied, setCopied] = useState(false);

  const highlighted =
    language && hljs.getLanguage(language)
      ? hljs.highlight(code, { language }).value
      : hljs.highlightAuto(code).value;

  const langLabel = language
    ? hljs.getLanguage(language)?.name ?? language
    : 'plain';

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="code-block__lang">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          {langLabel}
        </span>
        <button className="code-block__copy" onClick={copy} title="Copy code">
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
      <pre className="code-block__pre"><code dangerouslySetInnerHTML={{ __html: highlighted }} /></pre>
    </div>
  );
}
