"use client";
import { useEffect } from "react";
import { useStore } from "../state/useStore";
import { trackEvent } from "../utils/trackEvent";

export function ArticleViewTracker({ articleId, articleTitle }: { articleId: string; articleTitle: string }) {
  const user = useStore((s) => s.user);

  useEffect(() => {
    trackEvent({ event: 'article_view', articleId, articleTitle }, !!user?.author);
  }, [articleId]);

  return null;
}
