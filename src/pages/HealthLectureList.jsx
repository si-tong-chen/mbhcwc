import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { healthLectures } from '../data/healthLectures';

const PAST_PAGE_SIZE = 4;

const HealthLectureList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const now = new Date();
  const sorted = [...healthLectures].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
  const upcoming = sorted.filter((item) => new Date(item.dateTime) >= now);
  const past = sorted.filter((item) => new Date(item.dateTime) < now);
  const totalPastPages = Math.max(1, Math.ceil(past.length / PAST_PAGE_SIZE));
  const requestedPastPage = Number(searchParams.get('pastPage') || '1');
  const currentPastPage = Number.isNaN(requestedPastPage)
    ? 1
    : Math.min(Math.max(1, requestedPastPage), totalPastPages);
  const pastStartIndex = (currentPastPage - 1) * PAST_PAGE_SIZE;
  const pagedPast = past.slice(pastStartIndex, pastStartIndex + PAST_PAGE_SIZE);

  const goToPastPage = (page) => {
    const next = new URLSearchParams(searchParams);
    if (page <= 1) {
      next.delete('pastPage');
    } else {
      next.set('pastPage', String(page));
    }
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <section className="max-w-5xl mx-auto rounded-2xl bg-white/95 border border-[#E5C0C8]/60 shadow-md p-6 md:p-10">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E5C0C8]/60">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">专家健康大讲堂</h1>
              <Link to="/lectures/book" className="px-3 py-1.5 text-sm rounded-full bg-[#194F92] text-white hover:bg-[#143B70]">
                预约讲座
              </Link>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">近期讲座</h2>
              <div className="mt-3 divide-y divide-[#E5C0C8]/60">
                {upcoming.length === 0 && <div className="py-4 text-sm text-gray-500">暂无近期讲座。</div>}
                {upcoming.map((item) => (
                  <article key={item.slug} className="py-4">
                    <div className="flex items-start gap-4">
                      <img src={item.avatar} alt={item.speaker} className="w-12 h-12 rounded-full object-cover border border-[#EFB7BA]/60" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          <Link to={`/lectures/${item.slug}`} className="hover:text-[#194F92] hover:underline">
                            {item.title}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{new Date(item.dateTime).toLocaleString('zh-CN', { hour12: false })} · {item.location}</p>
                        <p className="mt-2 text-sm text-gray-600">{item.summary}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-semibold text-gray-900">往期讲座回放</h2>
              <div className="mt-3 divide-y divide-[#E5C0C8]/60">
                {past.length === 0 && <div className="py-4 text-sm text-gray-500">暂无往期讲座。</div>}
                {pagedPast.map((item) => (
                  <article key={item.slug} className="py-4">
                    <div className="flex items-start gap-4">
                      <img src={item.avatar} alt={item.speaker} className="w-12 h-12 rounded-full object-cover border border-[#EFB7BA]/60" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          <Link to={`/lectures/${item.slug}`} className="hover:text-[#194F92] hover:underline">
                            {item.title}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{new Date(item.dateTime).toLocaleString('zh-CN', { hour12: false })} · {item.location}</p>
                        <div className="mt-2 flex items-center gap-4">
                          <Link to={`/lectures/${item.slug}`} className="text-sm text-[#194F92] hover:underline">详情</Link>
                          {item.videoUrl && (
                            <a href={item.videoUrl} target="_blank" rel="noreferrer" className="text-sm text-[#C73A5C] hover:underline">
                              观看视频回放
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              {past.length > PAST_PAGE_SIZE && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToPastPage(currentPastPage - 1)}
                    disabled={currentPastPage === 1}
                    className="px-3 py-1.5 text-sm rounded border border-[#E5C0C8]/70 text-[#194F92] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FDF2F5]"
                  >
                    上一页
                  </button>
                  {Array.from({ length: totalPastPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => goToPastPage(page)}
                      className={`min-w-9 px-2 py-1.5 text-sm rounded border ${
                        page === currentPastPage
                          ? 'bg-[#194F92] text-white border-[#194F92]'
                          : 'border-[#E5C0C8]/70 text-[#194F92] hover:bg-[#FDF2F5]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => goToPastPage(currentPastPage + 1)}
                    disabled={currentPastPage === totalPastPages}
                    className="px-3 py-1.5 text-sm rounded border border-[#E5C0C8]/70 text-[#194F92] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FDF2F5]"
                  >
                    下一页
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HealthLectureList;
