import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { promoCategories, promoServices } from '../data/promoServices';

const PromoHub = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <section className="promo-hero rounded-3xl p-7 md:p-10">
            <p className="text-sm font-semibold text-[#194F92]">项目推广中心</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold text-[#1F2937] leading-tight">
              医疗协作与科研能力融合的
              <span className="text-[#C73A5C]">服务目录入口</span>
            </h1>
            <p className="mt-4 text-[#4B5563] leading-7 max-w-3xl">
              覆盖生育医学项目、细胞生物样本储存库与基因工程服务技术，按板块清晰下钻至具体服务详情。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="tel:01053608360" className="training-primary-btn">电话咨询</a>
            </div>
          </section>

          <section className="mt-10 md:mt-14">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#1F2937]">服务板块</h2>
              <span className="text-sm text-[#6B7280]">{promoServices.length} 个服务项</span>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {promoCategories.map((category) => {
                const total = promoServices.filter((item) => item.categorySlug === category.slug).length;
                return (
                  <Link key={category.slug} to={`/promo/${category.slug}`} className="training-track-card">
                    <p className="text-xs font-medium text-[#194F92]">服务板块</p>
                    <h3 className="mt-2 text-lg font-semibold text-[#1F2937]">{category.name}</h3>
                    <p className="mt-2 text-sm text-[#6B7280] leading-6">{category.positioning}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {category.highlights.map((item) => (
                        <span key={item} className="text-xs px-2 py-1 rounded-full border border-[#F3D5DC] text-[#C73A5C]">
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-xs text-[#9CA3AF]">{total} 项服务</span>
                      <span className="text-sm font-medium text-[#194F92]">进入板块 →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
            {promoCategories.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-[#E5C0C8] bg-[#FFF8FA] p-6 text-sm text-[#6B7280]">
                项目推广内容建设中
              </div>
            ) : null}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PromoHub;
