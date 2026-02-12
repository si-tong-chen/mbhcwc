import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { topicVideos } from '../data/topicVideos';

const PAGE_SIZE = 4;

const toEmbedUrl = (rawUrl) => {
  const text = String(rawUrl || '').trim();
  if (!text) return '';
  try {
    const url = new URL(text);
    const host = url.hostname.replace(/^www\./i, '').toLowerCase();
    if (host.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (host.includes('youtu.be')) {
      const videoId = url.pathname.replace(/^\/+/, '').split('/')[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    return text;
  } catch {
    return text;
  }
};

const isTopicVideoValid = (item) => {
  if (!item || item.status !== 'published') return false;
  if (item.cardType === 'image_link') {
    return Boolean(String(item.coverImage || '').trim()) && Boolean(String(item.actionUrl || '').trim());
  }
  if (item.cardType === 'embedded_video') {
    return Boolean(String(item.playUrl || '').trim());
  }
  return false;
};

const sortedVisibleVideos = (topicVideos || [])
  .filter(Boolean)
  .filter((item) => isTopicVideoValid(item))
  .sort((a, b) => {
    const pinnedA = a?.isPinned ? 1 : 0;
    const pinnedB = b?.isPinned ? 1 : 0;
    if (pinnedA !== pinnedB) return pinnedB - pinnedA;
    const sortA = Number(a?.sort_order || 0);
    const sortB = Number(b?.sort_order || 0);
    if (sortA !== sortB) return sortA - sortB;
    const updatedA = Date.parse(String(a?.updated_at || '')) || 0;
    const updatedB = Date.parse(String(b?.updated_at || '')) || 0;
    return updatedB - updatedA;
  });

const TopicVideos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(sortedVisibleVideos.length / PAGE_SIZE));
  const requestedPage = Number(searchParams.get('page') || '1');
  const currentPage = Number.isNaN(requestedPage) ? 1 : Math.min(Math.max(1, requestedPage), totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedVideos = sortedVisibleVideos.slice(startIndex, startIndex + PAGE_SIZE);
  const featured = sortedVisibleVideos.find((item) => item?.isFeatured) || sortedVisibleVideos[0] || null;
  const pageIntro = featured?.pageIntro || '专题视频围绕母婴健康服务、家庭照护实践与行业发展展开，内容结构简明，便于快速检索与持续更新。';

  const goToPage = (page) => {
    setSearchParams(page <= 1 ? {} : { page: String(page) });
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <section className="max-w-6xl mx-auto rounded-2xl bg-white/95 border border-[#E5C0C8]/60 shadow-md p-6 md:p-10">
            <div className="pb-5 border-b border-[#E5C0C8]/60">
              <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937]">专题视频</h1>
            </div>

            <section className="mt-6 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
              <div className="rounded-2xl border border-[#E5C0C8]/60 bg-[#FFF9FB] p-4">
                <div className="aspect-video rounded-xl border border-[#EFB7BA] bg-white overflow-hidden">
                  {featured?.cardType === 'embedded_video' && featured?.playUrl ? (
                    <iframe
                      title={featured.title || '专题视频'}
                      src={toEmbedUrl(featured.playUrl)}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : featured?.coverImage ? (
                    <img src={featured.coverImage} alt={featured.title || '专题视频封面'} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[#C73A5C] text-sm md:text-base">
                      暂无主视频
                    </div>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-[#1F2937]">{featured?.title || '暂无可展示视频'}</h2>
                <p className="mt-2 text-sm text-[#6B7280] leading-7">{featured?.summary || '请在后台发布专题视频后查看展示内容。'}</p>
              </div>

              <div className="rounded-2xl border border-[#E5C0C8]/60 bg-white p-4">
                <h3 className="text-lg font-semibold text-[#1F2937]">视频简介</h3>
                <p className="mt-3 text-sm text-[#6B7280] leading-7">
                  {pageIntro}
                </p>
              </div>
            </section>

            <section className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#1F2937]">视频总览</h2>
                <span className="text-sm text-[#6B7280]">共 {sortedVisibleVideos.length} 个视频</span>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {pagedVideos.length ? pagedVideos.map((item, index) => (
                  <article key={item.id || item.slug || `${item.title}-${index}`} className="rounded-xl border border-[#F3D5DC] bg-[#FFFCFD] p-4">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EA5036] text-xs font-semibold text-white">
                        {startIndex + index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-[#1F2937]">{item.title}</h3>
                        <p className="mt-2 text-sm text-[#6B7280] leading-7">{item.summary || '暂无摘要'}</p>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <span className="text-xs text-[#9CA3AF]">
                            {item.duration ? `时长：${item.duration}` : ''}
                          </span>
                          {item.cardType === 'embedded_video' && item.playUrl ? (
                            <a href={item.playUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#194F92] hover:underline">
                              查看详情
                            </a>
                          ) : null}
                          {item.cardType === 'image_link' && item.actionUrl ? (
                            <a href={item.actionUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#194F92] hover:underline">
                              查看详情
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </article>
                )) : (
                  <div className="rounded-xl border border-dashed border-[#E5C0C8] bg-[#FFF9FB] px-4 py-8 text-center text-sm text-[#6B7280] md:col-span-2">
                    暂无已发布的专题视频
                  </div>
                )}
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
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
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
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TopicVideos;
