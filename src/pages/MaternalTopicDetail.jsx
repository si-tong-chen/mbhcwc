import React from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { getMaternalTopicSubcategory } from '../data/maternalTopics';

const PAGE_SIZE = 10;

const MaternalTopicDetail = () => {
  const { topicSlug, subSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const detail = getMaternalTopicSubcategory(topicSlug, subSlug);

  if (!detail) return <Navigate to="/" replace />;

  const totalPages = Math.max(1, Math.ceil(detail.articles.length / PAGE_SIZE));
  const requestedPage = Number(searchParams.get('page') || '1');
  const currentPage = Number.isNaN(requestedPage) ? 1 : Math.min(Math.max(1, requestedPage), totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedArticles = detail.articles.slice(startIndex, startIndex + PAGE_SIZE);

  const goToPage = (page) => {
    setSearchParams(page <= 1 ? {} : { page: String(page) });
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <article className="max-w-4xl mx-auto rounded-2xl bg-white/95 border border-[#E5C0C8]/60 shadow-md p-6 md:p-10">
            <div className="mb-6 text-sm text-[#194F92] flex items-center gap-2">
              <Link to="/" className="hover:underline">首页</Link>
              <span>/</span>
              <Link to={`/maternal/${detail.topic.slug}`} className="hover:underline">{detail.topic.title}</Link>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{detail.title}</h1>

            <section className="mt-6">
              <ul className="space-y-3">
                {pagedArticles.map((article) => (
                  <li key={article.slug} className="rounded-xl border border-[#E5C0C8]/60 bg-[#FFF9FB] p-4">
                    <Link
                      to={`/maternal/${detail.topic.slug}/${detail.slug}/${article.slug}`}
                      className="text-lg font-semibold text-gray-900 hover:text-[#194F92] hover:underline"
                    >
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded border border-[#E5C0C8]/70 text-[#194F92] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FDF2F5]"
              >
                上一页
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={`min-w-9 px-2 py-1.5 text-sm rounded border ${
                    page === currentPage
                      ? 'bg-[#194F92] text-white border-[#194F92]'
                      : 'border-[#E5C0C8]/70 text-[#194F92] hover:bg-[#FDF2F5]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm rounded border border-[#E5C0C8]/70 text-[#194F92] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FDF2F5]"
              >
                下一页
              </button>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MaternalTopicDetail;
