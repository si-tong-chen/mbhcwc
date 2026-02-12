import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { getAssociationNoticeBySlug } from '../data/associationNotices';

const AssociationNoticeDetail = () => {
  const { slug } = useParams();
  const news = getAssociationNoticeBySlug(slug);

  if (!news) {
    return <Navigate to="/" replace />;
  }
  const hasImage = Boolean(String(news.image || '').trim());

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <article className="max-w-4xl mx-auto rounded-2xl bg-white/95 border border-[#E5C0C8]/60 shadow-md p-6 md:p-10">
            <div className="mb-6">
              <Link to="/notices" className="text-sm text-[#194F92] hover:underline">
                返回公告列表
              </Link>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed">
              {news.title}
            </h1>

            <div className="mt-4 pb-5 border-b border-[#E5C0C8]/60 text-sm text-gray-500">
              <span>发布时间：{news.date}</span>
            </div>

            {hasImage ? (
              <div className="mt-6 rounded-xl overflow-hidden border border-[#E5C0C8]/60">
                <img src={news.image} alt={news.title} className="w-full h-64 md:h-80 object-cover" />
              </div>
            ) : null}

            <div className="mt-8 space-y-5 text-[17px] leading-8 text-gray-700">
              {news.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AssociationNoticeDetail;
