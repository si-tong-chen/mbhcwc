import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { getMaternalTopicBySlug } from '../data/maternalTopics';

const MaternalTopicCategory = () => {
  const { topicSlug } = useParams();
  const topic = getMaternalTopicBySlug(topicSlug);

  if (!topic) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <section className="max-w-5xl mx-auto rounded-2xl bg-white/95 border border-[#E5C0C8]/60 shadow-md p-6 md:p-10">
            <div className="pb-5 border-b border-[#E5C0C8]/60">
              <Link to="/" className="text-sm text-[#194F92] hover:underline">返回首页</Link>
              <h1 className="mt-3 text-2xl md:text-3xl font-bold text-gray-900">{topic.title}</h1>
              <p className="mt-2 text-gray-600">{topic.positioning}</p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {topic.subcategories.map((item) => (
                <Link
                  key={item.slug}
                  to={`/maternal/${topic.slug}/${item.slug}`}
                  className="rounded-xl border border-[#E5C0C8]/60 bg-white px-4 py-4 hover:bg-[#FFF8FA] hover:border-[#EFB7BA] transition"
                >
                  <h2 className="font-semibold text-gray-900">{item.title}</h2>
                  <p className="mt-2 text-sm text-[#194F92]">查看文章</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MaternalTopicCategory;
