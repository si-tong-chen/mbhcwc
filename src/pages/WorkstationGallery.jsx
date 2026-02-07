import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

const PAGE_SIZE = 9;

const workstationPhotos = Array.from({ length: 27 }, (_, index) => ({
  id: index + 1,
  label: `工作站照片 ${index + 1}`
}));

const WorkstationGallery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(workstationPhotos.length / PAGE_SIZE));
  const requestedPage = Number(searchParams.get('page') || '1');
  const currentPage = Number.isNaN(requestedPage) ? 1 : Math.min(Math.max(1, requestedPage), totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentPhotos = workstationPhotos.slice(startIndex, startIndex + PAGE_SIZE);

  const goToPage = (page) => {
    setSearchParams(page <= 1 ? {} : { page: String(page) });
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-14">
        <div className="container mx-auto px-4">
          <section className="max-w-6xl mx-auto rounded-2xl bg-white/95 border border-[#E5C0C8]/60 shadow-md p-6 md:p-10">
            <div className="pb-5 border-b border-[#E5C0C8]/60">
              <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937]">工作站展示</h1>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentPhotos.map((photo) => (
                <article key={photo.id} className="rounded-2xl border border-[#E5C0C8]/60 bg-[#FFF9FB] p-4">
                  <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-[#EFB7BA] bg-white flex items-center justify-center text-[#C73A5C] text-sm md:text-base">
                    {photo.label}
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

export default WorkstationGallery;
