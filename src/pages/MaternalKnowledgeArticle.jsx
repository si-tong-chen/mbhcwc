import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { getMaternalKnowledgeArticle } from '../data/maternalTopics';

const MaternalKnowledgeArticle = () => {
  const { topicSlug, subSlug, articleSlug } = useParams();
  const article = getMaternalKnowledgeArticle(topicSlug, subSlug, articleSlug);

  if (!article) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <article className="max-w-4xl mx-auto rounded-2xl bg-white/95 border border-[#E5C0C8]/60 shadow-md p-6 md:p-10">
            <div className="text-sm text-[#194F92] flex items-center gap-2 mb-6">
              <Link to="/" className="hover:underline">首页</Link>
              <span>/</span>
              <Link to={`/maternal/${article.subcategory.topic.slug}`} className="hover:underline">
                {article.subcategory.topic.title}
              </Link>
              <span>/</span>
              <Link to={`/maternal/${article.subcategory.topic.slug}/${article.subcategory.slug}`} className="hover:underline">
                {article.subcategory.title}
              </Link>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed">{article.title}</h1>

            <div className="mt-4 text-sm text-gray-500">
              发布时间：{article.publishedAt}
            </div>

            <div className="mt-8 space-y-6 text-[17px] leading-8 text-gray-700">
              {article.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-[#F3D5DC] bg-[#FFF3F6] px-4 py-3 text-sm text-[#8B3A52]">
              温馨提示：本文用于母婴健康知识分享，不替代专业医生诊疗意见。
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MaternalKnowledgeArticle;
