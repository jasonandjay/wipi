import React from 'react';
import { NextPage } from 'next';
import { ArticleEditor } from '@/components/ArticleEditor';
import { AmArticleEditor } from '@/components/AmArticleEditor';

const Editor: NextPage = () => {
  return <AmArticleEditor />;
};

export default Editor;
