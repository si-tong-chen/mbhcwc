import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

const PAGE_SIZE = 4;

const videoItems = [
  {
    id: 'video-1',
    title: '专题视频 01：母婴健康基础认知',
    summary: '围绕母婴健康基本理念进行导读，帮助建立系统化认知框架。',
    duration: '12:30'
  },
  {
    id: 'video-2',
    title: '专题视频 02：产后恢复常见问题',
    summary: '聚焦产后阶段常见问题与家庭照护中的关键注意事项。',
    duration: '10:45'
  },
  {
    id: 'video-3',
    title: '专题视频 03：婴幼儿家庭照护要点',
    summary: '从日常照护、生活习惯到安全管理，梳理核心实践建议。',
    duration: '15:20'
  },
  {
    id: 'video-4',
    title: '专题视频 04：家庭健康管理方法',
    summary: '介绍家庭场景下可执行的健康管理路径与落地做法。',
    duration: '09:50'
  },
  {
    id: 'video-5',
    title: '专题视频 05：行业案例分享',
    summary: '通过典型案例讲解服务流程与实际操作中的关键节点。',
    duration: '13:10'
  },
  {
    id: 'video-6',
    title: '专题视频 06：健康教育与服务协同',
    summary: '讲解健康教育如何与服务体系协同推进并形成长期机制。',
    duration: '11:05'
  }
];

const TopicVideos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(videoItems.length / PAGE_SIZE));
  const requestedPage = Number(searchParams.get('page') || '1');
  const currentPage = Number.isNaN(requestedPage) ? 1 : Math.min(Math.max(1, requestedPage), totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedVideos = videoItems.slice(startIndex, startIndex + PAGE_SIZE);
  const featured = videoItems[0];

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
                <div className="aspect-video rounded-xl border-2 border-dashed border-[#EFB7BA] bg-white flex items-center justify-center text-[#C73A5C] text-sm md:text-base">
                  主视频播放位（预留）
                </div>
                <h2 className="mt-4 text-xl font-semibold text-[#1F2937]">{featured.title}</h2>
                <p className="mt-2 text-sm text-[#6B7280] leading-7">{featured.summary}</p>
              </div>

              <div className="rounded-2xl border border-[#E5C0C8]/60 bg-white p-4">
                <h3 className="text-lg font-semibold text-[#1F2937]">视频简介</h3>
                <p className="mt-3 text-sm text-[#6B7280] leading-7">
                  专题视频围绕母婴健康服务、家庭照护实践与行业发展展开，内容结构简明，便于快速检索与持续更新。
                </p>
                <div className="mt-4 rounded-xl bg-[#FFF5F7] border border-[#F3D5DC] p-3 text-sm text-[#4B5563]">
                  当前为模板布局，可按“视频封面 + 标题 + 时长 + 播放链接”直接扩展。
                </div>
              </div>
            </section>

            <section className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#1F2937]">视频总览</h2>
                <span className="text-sm text-[#6B7280]">共 {videoItems.length} 个视频</span>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {pagedVideos.map((item, index) => (
                  <article key={item.id} className="rounded-xl border border-[#F3D5DC] bg-[#FFFCFD] p-4">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EA5036] text-xs font-semibold text-white">
                        {startIndex + index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-[#1F2937]">{item.title}</h3>
                        <p className="mt-2 text-sm text-[#6B7280] leading-7">{item.summary}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-[#9CA3AF]">时长：{item.duration}</span>
                          <button
                            type="button"
                            className="text-sm font-medium text-[#194F92] hover:underline"
                          >
                            查看详情
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
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
