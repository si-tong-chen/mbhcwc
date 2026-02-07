import React, { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { getPromoCategoryBySlug, getPromoServicesByCategory } from '../data/promoServices';

const PromoCategory = () => {
  const { categorySlug } = useParams();
  const category = getPromoCategoryBySlug(categorySlug);
  const services = getPromoServicesByCategory(categorySlug);

  const [audienceFilter, setAudienceFilter] = useState('全部对象');
  const [regionFilter, setRegionFilter] = useState('全部地区');
  const [cycleFilter, setCycleFilter] = useState('全部周期');

  const audienceOptions = useMemo(
    () => ['全部对象', ...Array.from(new Set(services.flatMap((item) => item.audienceTags)))],
    [services]
  );
  const regionOptions = useMemo(
    () => ['全部地区', ...Array.from(new Set(services.flatMap((item) => item.regions)))],
    [services]
  );
  const cycleOptions = useMemo(
    () => ['全部周期', ...Array.from(new Set(services.map((item) => item.deliveryCycle)))],
    [services]
  );

  const filteredServices = useMemo(
    () =>
      services.filter((item) => {
        const audienceMatched = audienceFilter === '全部对象' || item.audienceTags.includes(audienceFilter);
        const regionMatched = regionFilter === '全部地区' || item.regions.includes(regionFilter);
        const cycleMatched = cycleFilter === '全部周期' || item.deliveryCycle === cycleFilter;
        return audienceMatched && regionMatched && cycleMatched;
      }),
    [services, audienceFilter, regionFilter, cycleFilter]
  );

  if (!category) return <Navigate to="/promo" replace />;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <section className="rounded-2xl border border-[#F3D5DC] bg-white/95 p-6 md:p-8">
            <div className="text-sm text-[#194F92]">
              <Link to="/promo" className="hover:underline">项目推广</Link>
              <span className="mx-2 text-[#9CA3AF]">/</span>
              <span>{category.name}</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold text-[#1F2937]">{category.name}</h1>
            <p className="mt-3 text-[#4B5563] leading-7">{category.positioning}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.highlights.map((item) => (
                <span key={item} className="text-xs px-2 py-1 rounded-full border border-[#F3D5DC] text-[#C73A5C]">{item}</span>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-[#F3D5DC] bg-white/95 p-5 md:p-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-[#6B7280]">适用对象</span>
                {audienceOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setAudienceFilter(item)}
                    className={`training-filter-btn ${audienceFilter === item ? 'is-active' : ''}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-[#6B7280]">地区</span>
                {regionOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRegionFilter(item)}
                    className={`training-filter-btn ${regionFilter === item ? 'is-active' : ''}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-[#6B7280]">交付周期</span>
                {cycleOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCycleFilter(item)}
                    className={`training-filter-btn ${cycleFilter === item ? 'is-active' : ''}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredServices.map((service) => (
                <article key={service.slug} className="training-course-card">
                  <img src={service.coverImage} alt={service.title} className="w-full h-40 object-cover rounded-xl border border-[#F3D5DC]" />
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold text-[#1F2937]">{service.title}</h2>
                    <p className="mt-1 text-sm text-[#6B7280]">{service.subtitle}</p>
                    <p className="mt-2 text-sm text-[#4B5563] line-clamp-3">{service.summary}</p>
                  </div>
                  <div className="mt-3 text-sm text-[#4B5563]">
                    <p>价格区间：{service.priceRange}</p>
                    <p>周期：{service.deliveryCycle}</p>
                  </div>
                  <Link to={`/promo/${category.slug}/${service.slug}`} className="mt-4 training-inline-link">查看详情 →</Link>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-[#F3D5DC] bg-white/95 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-[#1F2937]">板块咨询</h3>
              <p className="mt-2 text-sm text-[#6B7280]">可根据你的目标与预算推荐服务路径。</p>
            </div>
            <a href="tel:01053608360" className="training-primary-btn">电话咨询</a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PromoCategory;
