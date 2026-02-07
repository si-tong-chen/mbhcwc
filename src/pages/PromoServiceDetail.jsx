import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { getPromoCategoryBySlug, getPromoServiceBySlug } from '../data/promoServices';

const PromoServiceDetail = () => {
  const { categorySlug, serviceSlug } = useParams();
  const category = getPromoCategoryBySlug(categorySlug);
  const service = getPromoServiceBySlug(categorySlug, serviceSlug);

  const [form, setForm] = useState({ name: '', phone: '', city: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  if (!category || !service) return <Navigate to="/promo" replace />;

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const phone = form.phone.trim();
    const city = form.city.trim();
    if (!name || !phone || !city) {
      setStatus({ type: 'error', message: '请填写姓名、手机号和所在城市。' });
      return;
    }

    setSubmitting(true);
    setStatus({ type: '', message: '' });
    try {
      const response = await fetch('/api/promo-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceSlug: service.slug,
          categorySlug: service.categorySlug,
          name,
          phone,
          city,
          message: form.message.trim(),
          source: 'promo-service-detail'
        })
      });
      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || '提交失败，请稍后重试。');
      }
      setStatus({ type: 'success', message: '提交成功，我们会尽快联系您。' });
      setForm({ name: '', phone: '', city: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || '提交失败，请稍后重试。' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-12 md:py-16 pb-28 md:pb-16">
        <div className="container mx-auto px-4">
          <section className="training-detail-hero rounded-2xl p-6 md:p-8">
            <div className="text-sm text-[#194F92]">
              <Link to="/promo" className="hover:underline">项目推广</Link>
              <span className="mx-2 text-[#9CA3AF]">/</span>
              <Link to={`/promo/${category.slug}`} className="hover:underline">{category.name}</Link>
              <span className="mx-2 text-[#9CA3AF]">/</span>
              <span>{service.title}</span>
            </div>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold text-[#1F2937]">{service.title}</h1>
            <p className="mt-2 text-[#6B7280]">{service.subtitle}</p>
            <p className="mt-4 training-paragraph max-w-4xl">{service.summary}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`tel:${service.contact.phone}`} className="training-primary-btn">电话咨询</a>
            </div>
          </section>

          <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <article className="rounded-2xl border border-[#F3D5DC] bg-white/95 p-6">
              <h2 className="training-section-title">适用对象</h2>
              <ul className="mt-4 space-y-2">
                {service.audience.map((item) => (
                  <li key={item} className="training-list-item">{item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-[#F3D5DC] bg-white/95 p-6">
              <h2 className="training-section-title">服务内容与流程</h2>
              <ol className="mt-4 space-y-2">
                {service.process.map((item) => (
                  <li key={item} className="training-list-item">{item}</li>
                ))}
              </ol>
            </article>
          </section>

          <section id="promo-inquiry-anchor" className="mt-6 rounded-2xl border border-[#F3D5DC] bg-white/95 p-6">
            <h2 className="training-section-title">价格区间</h2>
            <p className="mt-4 text-lg font-semibold text-[#1F2937]">{service.priceRange}</p>
            <p className="mt-2 text-sm text-[#6B7280]">交付周期：{service.deliveryCycle}</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {service.priceFactors.map((item) => (
                <div key={item} className="training-info-pill">
                  <span className="training-pill-label">影响因素</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <article className="rounded-2xl border border-[#F3D5DC] bg-white/95 p-6">
              <h2 className="training-section-title">设施与能力</h2>
              <ul className="mt-4 space-y-2">
                {service.capabilities.map((item) => (
                  <li key={item} className="training-list-item">{item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-[#F3D5DC] bg-white/95 p-6">
              <h2 className="training-section-title">资质与标准</h2>
              <ul className="mt-4 space-y-2">
                {service.certifications.map((item) => (
                  <li key={item} className="training-list-item">{item}</li>
                ))}
              </ul>
            </article>
          </section>

          <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <article className="rounded-2xl border border-[#F3D5DC] bg-white/95 p-6">
              <h2 className="training-section-title">风险提示</h2>
              <p className="mt-4 training-paragraph">{service.riskNotice}</p>
            </article>
            <article className="rounded-2xl border border-[#F3D5DC] bg-white/95 p-6">
              <h2 className="training-section-title">合规说明</h2>
              <p className="mt-4 training-paragraph">{service.complianceNotice}</p>
            </article>
          </section>

          <section className="mt-6 rounded-2xl border border-[#F3D5DC] bg-white/95 p-6">
            <h2 className="training-section-title">常见问题</h2>
            <div className="mt-4 space-y-3">
              {service.faq.map((item) => (
                <article key={item.q} className="rounded-xl border border-[#F3D5DC] bg-[#FFF8FA] p-4">
                  <h3 className="text-base font-semibold text-[#1F2937]">{item.q}</h3>
                  <p className="mt-2 text-sm text-[#4B5563] leading-6">{item.a}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-[#F3D5DC] bg-white/95 p-6">
            <h2 className="training-section-title">咨询提交</h2>
            <form onSubmit={onSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => onChange('name', e.target.value)}
                  placeholder="姓名"
                  className="rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CBD5F0]"
                />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => onChange('phone', e.target.value)}
                  placeholder="手机号"
                  className="rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CBD5F0]"
                />
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => onChange('city', e.target.value)}
                  placeholder="所在城市"
                  className="rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CBD5F0]"
                />
              </div>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => onChange('message', e.target.value)}
                placeholder="请填写您的具体需求（选填）"
                className="w-full rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CBD5F0]"
              />

              {status.message ? (
                <p className={`text-sm ${status.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{status.message}</p>
              ) : null}

              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-[#6B7280]">咨询电话：{service.contact.phone}</p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="training-primary-btn disabled:opacity-60"
                >
                  {submitting ? '提交中...' : '提交咨询'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>

      <div className="training-mobile-cta">
        <a href={`tel:${service.contact.phone}`}>电话咨询</a>
        <a href="#promo-inquiry-anchor">提交咨询</a>
      </div>

      <Footer />
    </div>
  );
};

export default PromoServiceDetail;
