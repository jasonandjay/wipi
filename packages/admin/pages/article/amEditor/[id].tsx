import React from 'react';
import { NextPage } from 'next';
import { ArticleProvider } from '@/providers/article';
import { AmArticleEditor } from '@/components/AmArticleEditor';

interface IProps {
  id: string | number;
  article: IArticle;
}

const Editor: NextPage<IProps> = ({ id, article }) => {
  return <AmArticleEditor id={id} article={article} />;
};

Editor.getInitialProps = async (ctx) => {
  const { id } = ctx.query;
  const article = await ArticleProvider.getArticle(id);
  return { id, article } as { id: string | number; article: IArticle };
};

export default Editor;
