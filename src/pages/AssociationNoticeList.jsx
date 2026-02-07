import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { associationNotices } from '../data/associationNotices';

const PAGE_SIZE = 10;

const AssociationNoticeList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const formatDateParts = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return { year, month, day };
  };

  const keyword = (searchParams.get('q') || '').trim();
  const sortedNews = [...associationNotices].sort((a, b) => new Date(b.date) - new Date(a.date));
  const filteredNews = sortedNews.filter((item) => {
    if (!keyword) return true;
    const haystack = `${item.title} ${item.summary} ${item.content.join(' ')} ${item.date}`.toLowerCase();
    return haystack.includes(keyword.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / PAGE_SIZE));
  const requestedPage = Number(searchParams.get('page') || '1');
  const currentPage = Number.isNaN(requestedPage) ? 1 : Math.min(Math.max(1, requestedPage), totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedNews = filteredNews.slice(startIndex, startIndex + PAGE_SIZE);

  const goToPage = (page) => {
    const next = {};
    if (keyword) next.q = keyword;
    if (page > 1) next.page = String(page);
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <section className="max-w-5xl mx-auto rounded-2xl bg-white/95 border border-[#E5C0C8]/60 shadow-md p-6 md:p-10">
            <div className="pb-4 border-b border-[#E5C0C8]/60">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">协会公告</h1>
              {keyword && (
                <p className="mt-2 text-sm text-gray-500">
                  搜索关键词：<span className="text-[#194F92]">{keyword}</span>
                </p>
              )}
            </div>

            <div className="mt-4 divide-y divide-[#E5C0C8]/60">
              {pagedNews.length === 0 && (
                <div className="py-10 text-center text-gray-500">暂无相关公告，请尝试其他关键词。</div>
              )}
              {pagedNews.map((item) => {
                const { year, month, day } = formatDateParts(item.date);
                return (
                  <article key={item.slug} className="py-5">
                    <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                      <div className="md:w-28 md:flex-shrink-0 text-[#194F92]">
                        <div className="text-2xl font-semibold leading-none">{day}</div>
                        <div className="mt-2 text-xs tracking-wide">{year}.{month}</div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-900 leading-8">
                          <Link to={`/notices/${item.slug}`} className="hover:text-[#194F92]">
                            {item.title}
                          </Link>
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 leading-7">{item.summary}</p>
                        <div className="mt-3 text-sm text-gray-500">
                          发布时间：{item.date}
                          <Link to={`/notices/${item.slug}`} className="ml-5 text-[#194F92] hover:underline">
                            详情
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

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
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AssociationNoticeList;
