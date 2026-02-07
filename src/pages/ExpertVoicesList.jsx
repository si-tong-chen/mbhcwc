import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { expertVoices } from '../data/expertVoices';

const PAGE_SIZE = 6;

const ExpertVoicesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(expertVoices.length / PAGE_SIZE));
  const requestedPage = Number(searchParams.get('page') || '1');
  const currentPage = Number.isNaN(requestedPage) ? 1 : Math.min(Math.max(1, requestedPage), totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedExperts = expertVoices.slice(startIndex, startIndex + PAGE_SIZE);

  const goToPage = (page) => {
    setSearchParams(page <= 1 ? {} : { page: String(page) });
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <section className="max-w-6xl mx-auto rounded-2xl bg-white/95 border border-[#E5C0C8]/60 shadow-md overflow-hidden">
            <div className="px-6 md:px-10 py-10 border-b border-[#E5C0C8]/60 bg-[linear-gradient(120deg,#FFF8FA_0%,#FDF2F5_100%)]">
              <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">名家名说</h1>
              <p className="mt-4 text-gray-600 leading-7 max-w-3xl">
                汇集不同领域名家的临床经验与实践观点，围绕女性健康、母婴照护与家庭管理，呈现可执行、可落地的专业思路。
              </p>
            </div>

            <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pagedExperts.map((expert) => (
                <article
                  key={expert.slug}
                  className="group rounded-2xl border border-[#E5C0C8]/60 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <div className="h-48 overflow-hidden bg-[#FDF2F5]">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-900">
                      <Link to={`/experts/${expert.slug}`} className="hover:text-[#194F92]">
                        {expert.name}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-[#194F92]">{expert.title}</p>
                    <p className="mt-1 text-xs text-gray-500">{expert.institution}</p>
                    <p className="mt-4 text-sm text-gray-600 leading-7 line-clamp-3">{expert.quote}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {expert.topics.map((topic) => (
                        <span key={topic} className="text-xs px-2.5 py-1 rounded-full bg-[#F9E5EA] text-[#A84A62]">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="px-6 md:px-10 pb-8 md:pb-10 flex items-center justify-center gap-2">
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

export default ExpertVoicesList;
